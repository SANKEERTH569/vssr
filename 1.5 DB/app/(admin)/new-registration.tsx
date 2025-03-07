import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ArrowLeft, Save } from 'lucide-react-native';

// Generate a random hotel ID
const generateHotelId = () => {
  const prefix = 'KIR';
  const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number
  return `${prefix}${randomNum}`;
};

export default function NewRegistrationScreen() {
  const router = useRouter();
  const [hotelId] = useState(generateHotelId());
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [addressLink, setAddressLink] = useState('');
  const [errors, setErrors] = useState({
    ownerName: '',
    phoneNumber: '',
    address: '',
  });

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      ownerName: '',
      phoneNumber: '',
      address: '',
    };

    if (!ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?[0-9]{10,12}$/.test(phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Enter a valid phone number';
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // In a real app, this would save to Firebase
    Alert.alert(
      'Registration Successful',
      `Hotel ID: ${hotelId}\nOwner: ${ownerName}\nPhone: ${phoneNumber}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Registration</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.hotelIdContainer}>
            <Text style={styles.hotelIdLabel}>Hotel ID (Auto-generated)</Text>
            <Text style={styles.hotelId}>{hotelId}</Text>
          </View>

          <Input
            label="Owner Name"
            placeholder="Enter owner name"
            value={ownerName}
            onChangeText={(text) => {
              setOwnerName(text);
              setErrors({ ...errors, ownerName: '' });
            }}
            error={errors.ownerName}
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              setErrors({ ...errors, phoneNumber: '' });
            }}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
          />

          <Input
            label="Address"
            placeholder="Enter full address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setErrors({ ...errors, address: '' });
            }}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.addressInput}
            error={errors.address}
          />

          <Input
            label="Address Link (Optional)"
            placeholder="Enter Google Maps link"
            value={addressLink}
            onChangeText={setAddressLink}
          />

          <Button
            title="Save Registration"
            onPress={handleSave}
            variant="primary"
            size="large"
            style={styles.saveButton}
            icon={<Save size={20} color="white" style={{ marginRight: 8 }} />}
          />
        </View>
      </ScrollView>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  hotelIdContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  hotelIdLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  hotelId: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.primary,
  },
  addressInput: {
    height: 80,
    paddingTop: 12,
  },
  saveButton: {
    marginTop: 24,
  },
});