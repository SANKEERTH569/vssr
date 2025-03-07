import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS } from '@/constants/Colors';
import Button from '@/components/common/Button';
import { Mic, Plus, Minus } from 'lucide-react-native';
import { collection, addDoc } from 'firebase/firestore';

// Mock data for grocery items
const GROCERY_ITEMS = [
  { id: 1, name: 'Rice', price: 50, unit: 'kg' },
  { id: 2, name: 'Wheat Flour', price: 40, unit: 'kg' },
  { id: 3, name: 'Sugar', price: 45, unit: 'kg' },
  { id: 4, name: 'Cooking Oil', price: 120, unit: 'liter' },
  { id: 5, name: 'Milk', price: 60, unit: 'liter' },
  { id: 6, name: 'Tomatoes', price: 30, unit: 'kg' },
  { id: 7, name: 'Onions', price: 25, unit: 'kg' },
  { id: 8, name: 'Potatoes', price: 20, unit: 'kg' },
  { id: 9, name: 'Lentils', price: 90, unit: 'kg' },
  { id: 10, name: 'Salt', price: 15, unit: 'kg' },
];

// Mock data for delivery dates
const DELIVERY_DATES = {
  '2025-01-05': { marked: true, dotColor: COLORS.success },
  '2025-01-10': { marked: true, dotColor: COLORS.success },
  '2025-01-15': { marked: true, dotColor: COLORS.error },
  '2025-01-20': { marked: true, dotColor: COLORS.success },
};

export default function UserHomeScreen() {
  const [quantities, setQuantities] = useState<Record<number, number>>(
    GROCERY_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const hotelId = 'KIR001'; // Mock hotel ID

  const handleQuantityChange = (id: number, change: number) => {
    setQuantities(prev => {
      const newQuantity = Math.max(0, (prev[id] || 0) + change);
      return { ...prev, [id]: newQuantity };
    });
  };

  const calculateTotal = () => {
    return GROCERY_ITEMS.reduce((total, item) => {
      return total + (quantities[item.id] || 0) * item.price;
    }, 0);
  };

  const handleConfirmOrder = async () => {
    const order = {
      items: GROCERY_ITEMS.filter(item => quantities[item.id] > 0).map(item => ({
        ...item,
        quantity: quantities[item.id],
      })),
      note,
      total: calculateTotal(),
      date: new Date().toISOString(),
      hotelId,
    };

    try {
      await addDoc(collection(db, 'orders'), order);
      console.log('Order confirmed:', order);
      
      // Reset form
      setQuantities(GROCERY_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}));
      setNote('');
      
      // Show success message (in a real app, this would be a proper notification)
      alert('Order confirmed successfully!');
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Failed to confirm order. Please try again.');
    }
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>THATKart</Text>
        <View style={styles.hotelIdContainer}>
          <Text style={styles.hotelIdLabel}>Hotel ID</Text>
          <Text style={styles.hotelId}>{hotelId}</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>Delivery Calendar</Text>
        <TouchableOpacity onPress={toggleCalendar} style={styles.dateBox}>
          <Text style={styles.dateText}>
            {selectedDate ? selectedDate : 'Select Delivery Date'}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <Calendar
            markedDates={DELIVERY_DATES}
            onDayPress={handleDayPress}
            theme={{
              todayTextColor: COLORS.primary,
              arrowColor: COLORS.primary,
              dotColor: COLORS.primary,
              selectedDayBackgroundColor: COLORS.primary,
            }}
          />
        )}

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendText}>Successful Delivery</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
            <Text style={styles.legendText}>Failed Delivery</Text>
          </View>
        </View>
      </View>

      <View style={styles.groceryListContainer}>
        <Text style={styles.sectionTitle}>Today's Grocery List</Text>
        
        {GROCERY_ITEMS.map((item) => (
          <View key={item.id} style={styles.groceryItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}/{item.unit}</Text>
            </View>
            
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, -1)}
              >
                <Minus size={16} color={COLORS.darkGray} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantities[item.id] || 0}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, 1)}
              >
                <Plus size={16} color={COLORS.darkGray} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
        </View>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteLabel}>Additional Notes:</Text>
        <View style={styles.noteInputContainer}>
          <TextInput
            style={styles.noteInput}
            placeholder="Add any special requests here..."
            value={note}
            onChangeText={setNote}
            multiline
          />
          <TouchableOpacity style={styles.micButton}>
            <Mic size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Button
        title="Confirm Order"
        onPress={handleConfirmOrder}
        variant="primary"
        size="large"
        style={styles.confirmButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  hotelIdContainer: {
    alignItems: 'center',
  },
  hotelIdLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.darkGray,
  },
  hotelId: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.text,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  dateBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.darkGray,
  },
  groceryListContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groceryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
  },
  itemPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
  },
  totalAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  noteContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noteLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  noteInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  noteInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  micButton: {
    padding: 8,
  },
  confirmButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
});