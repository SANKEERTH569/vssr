import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import { 
  Menu, 
  LogOut, 
  Bell, 
  Check, 
  ChevronRight,
  UserPlus,
  Users,
  Package,
  ClipboardList,
  Clock
} from 'lucide-react-native';

// Mock data for today's orders
const TODAY_ORDERS = [
  {
    id: '1',
    hotelId: 'KIR001',
    hotelName: 'Hotel Sunshine',
    items: [
      { name: 'Rice', quantity: 5, price: 50, unit: 'kg' },
      { name: 'Wheat Flour', quantity: 2, price: 40, unit: 'kg' },
      { name: 'Cooking Oil', quantity: 3, price: 120, unit: 'liter' },
    ],
    note: 'Please deliver before noon',
    total: 610,
    checked: false,
    ready: false,
  },
  {
    id: '2',
    hotelId: 'KIR002',
    hotelName: 'Grand Restaurant',
    items: [
      { name: 'Milk', quantity: 10, price: 60, unit: 'liter' },
      { name: 'Tomatoes', quantity: 3, price: 30, unit: 'kg' },
      { name: 'Onions', quantity: 4, price: 25, unit: 'kg' },
    ],
    note: '',
    total: 790,
    checked: false,
    ready: false,
  },
  {
    id: '3',
    hotelId: 'KIR003',
    hotelName: 'Spice Garden',
    items: [
      { name: 'Potatoes', quantity: 5, price: 20, unit: 'kg' },
      { name: 'Lentils', quantity: 2, price: 90, unit: 'kg' },
      { name: 'Salt', quantity: 1, price: 15, unit: 'kg' },
    ],
    note: 'Need extra potatoes if available',
    total: 295,
    checked: true,
    ready: false,
  },
];

// Mock data for metrics
const METRICS = {
  totalRegistrations: 15,
  todayOrders: 3,
  pendingOrders: 12,
};

export default function AdminHomeScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState(TODAY_ORDERS);
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }));

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCheckOrder = (id: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, checked: true } : order
      )
    );
    
    // Close the modal
    setSelectedOrder(null);
  };

  const handleReadyOrder = (id: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, ready: true } : order
      )
    );
  };

  const handleSendNotifications = () => {
    // In a real app, this would send notifications to users
    alert('Notifications sent to all users to confirm their orders for today!');
  };

  const navigateToScreen = (screen: string) => {
    router.push(`/(admin)/${screen}`);
    setIsSidebarOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
          <Menu size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kirana Admin</Text>
        <TouchableOpacity onPress={handleLogout}>
          <LogOut size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Registrations</Text>
          <Text style={styles.metricValue}>{METRICS.totalRegistrations}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Today's Orders</Text>
          <Text style={styles.metricValue}>{METRICS.todayOrders}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Pending Orders</Text>
          <Text style={styles.metricValue}>{METRICS.pendingOrders}</Text>
        </View>
      </View>

      {/* Date Display */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.ordersContainer}>
        <Text style={styles.sectionTitle}>Today's Orders</Text>
        
        {orders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.hotelId}>{order.hotelId}</Text>
              <Text style={styles.hotelName}>{order.hotelName}</Text>
            </View>
            
            <View style={styles.orderActions}>
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => setSelectedOrder(order)}
              >
                <Text style={styles.detailsButtonText}>Order Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  order.ready ? styles.completedButton : (order.checked ? styles.readyButton : styles.disabledButton)
                ]}
                disabled={!order.checked || order.ready}
                onPress={() => handleReadyOrder(order.id)}
              >
                <Text style={styles.actionButtonText}>
                  {order.ready ? 'Ready' : 'Mark Ready'}
                </Text>
                {order.ready && <Check size={16} color={COLORS.white} style={{ marginLeft: 4 }} />}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Notification Button */}
      <View style={styles.notificationContainer}>
        <Button
          title="Send Order Notifications"
          onPress={handleSendNotifications}
          variant="primary"
          size="large"
          icon={<Bell size={20} color="white" style={{ marginRight: 8 }} />}
        />
      </View>

      {/* Sidebar Menu */}
      <Modal
        visible={isSidebarOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSidebarOpen(false)}
      >
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sidebarContent}>
              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateToScreen('new-registration')}
              >
                <UserPlus size={20} color={COLORS.text} style={styles.sidebarIcon} />
                <Text style={styles.sidebarItemText}>New Registration</Text>
                <ChevronRight size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateToScreen('user-details')}
              >
                <Users size={20} color={COLORS.text} style={styles.sidebarIcon} />
                <Text style={styles.sidebarItemText}>User Details</Text>
                <ChevronRight size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateToScreen('delivery')}
              >
                <Package size={20} color={COLORS.text} style={styles.sidebarIcon} />
                <Text style={styles.sidebarItemText}>Delivery</Text>
                <ChevronRight size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateToScreen('default-orders')}
              >
                <ClipboardList size={20} color={COLORS.text} style={styles.sidebarIcon} />
                <Text style={styles.sidebarItemText}>Default Orders</Text>
                <ChevronRight size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sidebarItem}
                onPress={() => navigateToScreen('past-orders')}
              >
                <Clock size={20} color={COLORS.text} style={styles.sidebarIcon} />
                <Text style={styles.sidebarItemText}>Past Orders</Text>
                <ChevronRight size={16} color={COLORS.gray} />
              </TouchableOpacity>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color={COLORS.error} style={styles.sidebarIcon} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        visible={!!selectedOrder}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderInfoLabel}>Hotel ID:</Text>
                  <Text style={styles.orderInfoValue}>{selectedOrder.hotelId}</Text>
                </View>
                
                <View style={styles.orderInfo}>
                  <Text style={styles.orderInfoLabel}>Hotel Name:</Text>
                  <Text style={styles.orderInfoValue}>{selectedOrder.hotelName}</Text>
                </View>
                
                <Text style={styles.itemsTitle}>Items:</Text>
                {selectedOrder.items.map((item: any, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>₹{item.price}/{item.unit}</Text>
                    </View>
                    <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
                    <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
                  </View>
                ))}
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>₹{selectedOrder.total}</Text>
                </View>
                
                {selectedOrder.note ? (
                  <View style={styles.noteContainer}>
                    <Text style={styles.noteLabel}>Note:</Text>
                    <Text style={styles.noteText}>{selectedOrder.note}</Text>
                  </View>
                ) : null}
                
                {!selectedOrder.checked && (
                  <Button
                    title="Check Order"
                    onPress={() => handleCheckOrder(selectedOrder.id)}
                    variant="primary"
                    size="large"
                    style={styles.checkButton}
                    icon={<Check size={20} color="white" style={{ marginRight: 8 }} />}
                  />
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
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
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  metricLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  dateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
  },
  ordersContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    marginBottom: 12,
  },
  hotelId: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.darkGray,
  },
  hotelName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.text,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  readyButton: {
    backgroundColor: COLORS.primary,
  },
  completedButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.white,
  },
  notificationContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: '80%',
    height: '100%',
    backgroundColor: COLORS.white,
    paddingTop: 50,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sidebarTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.text,
  },
  closeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sidebarIcon: {
    marginRight: 12,
  },
  sidebarItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
  },
  modalBody: {
    padding: 16,
  },
  orderInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  orderInfoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.darkGray,
    width: 100,
  },
  orderInfoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  itemsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  itemInfo: {
    flex: 2,
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
  },
  itemPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.darkGray,
  },
  itemQuantity: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  itemTotal: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.text,
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  noteContainer: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  noteLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  noteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  checkButton: {
    marginTop: 24,
  },
});