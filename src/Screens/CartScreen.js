import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ route, navigation }) => {
  // Destructure passed props (cart, updateCart, clearCart)
  const { cart: initialCart, updateCart, clearCart } = route.params;

  // Maintain local cart state to force re-render on focus
  const [cart, setCart] = useState(initialCart);

  useFocusEffect(
    React.useCallback(() => {
      // Sync local cart with passed cart on screen focus
      setCart(route.params.cart);
    }, [route.params.cart])
  );

  const getTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty');
      return;
    }
    Alert.alert('Order Placed', 'Thank you for ordering!', [
      {
        text: 'OK',
        onPress: () => {
          clearCart();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  const removeItem = (id) => {
    const filtered = cart.filter((item) => item.id !== id);
    updateCart(filtered);
    setCart(filtered);
  };

  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) {
          return null; // Remove if qty < 1
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean);

    updateCart(updated);
    setCart(updated);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.dish}</Text>
        <View style={styles.qtyAndRemove}>
          <View style={styles.qtyControls}>
            <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyButton}>
              <Text style={styles.qtyText}>–</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyButton}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>

             <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Remove</Text>
          </TouchableOpacity>
          </View>
         
        </View>
      </View>
      <Text style={styles.price}>₹{item.price * item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Cart is empty</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ₹{getTotal()}</Text>
        <TouchableOpacity onPress={handleOrder} style={styles.orderBtn}>
          <Text style={{ fontWeight: 'bold' }}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', paddingTop: 40 },
  title: { color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  emptyText: { color: 'white', fontSize: 18, textAlign: 'center', marginTop: 50 },
  item: {
    flexDirection: 'row',
    backgroundColor: '#222',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  image: { width: 90, height: 90, borderRadius: 10 },
  details: { flex: 1, marginLeft: 10 },
  name: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  qtyAndRemove: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  qtyControls: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: {
    backgroundColor: 'grey',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  qtyText: { color: 'white', fontSize: 18 },
  deleteButton: { marginLeft: 10 },
  price: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#111',
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  orderBtn: {
    backgroundColor: 'yellow',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

export default CartScreen;
