import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const SearchResultsScreen = ({ route, navigation }) => {
  const { results, cart: initialCart, updateCart, clearCart } = route.params;
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState(initialCart);

  useFocusEffect(
    React.useCallback(() => {
      setCart(route.params.cart);
    }, [route.params.cart])
  );

  const updateQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] ?? 0;
    if (quantity === 0) return Alert.alert('Please select quantity before adding.');

    const index = cart.findIndex(cartItem => cartItem.id === item.id);
    let updatedCart;
    if (index !== -1) {
      updatedCart = [...cart];
      updatedCart[index].quantity += quantity;
    } else {
      updatedCart = [...cart, { ...item, quantity }];
    }

    updateCart(updatedCart);
    setCart(updatedCart);
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
    Alert.alert('Added to cart', `${item.dish} (${quantity}) added`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.dish}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>–</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantities[item.id] ?? 0}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => addToCart(item)} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {results.length === 0 ? (
        <Text style={styles.noResults}>No results found</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart', { cart, updateCart, clearCart })}
      >
        <Text style={{ color: 'black', fontWeight: 'bold' }}>
          Go to Cart ({cart.reduce((a, i) => a + i.quantity, 0)})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', padding: 10 },
  item: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  name: { color: 'white', fontSize: 18, fontWeight: 'bold' , marginLeft:20},
  price: { color: '#ccc', marginBottom: 10 ,marginLeft:20},
  qtyContainer: {
    
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  qtyBtn: {
   
    backgroundColor: 'grey',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 5,
    borderRadius: 5,marginLeft:20,
  },
  qtyText: { color: 'white', fontSize: 16 ,marginLeft:3},
  addButton: {
    backgroundColor: 'yellow',
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft:20
  },
  addButtonText: { color: 'black', fontWeight: 'bold' },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
  },
  noResults: { color: 'white', textAlign: 'center', marginTop: 50, fontSize: 18 },
});

export default SearchResultsScreen;
