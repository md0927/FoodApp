import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import axios from 'axios';

import AutoScrollCarousel from './AutoScrollCarousel';

const  HomePage = ({ navigation }) => {
  const [mainCourse, setMainCourse] = useState([]);
  const [starters, setStarters] = useState([]);
  const [deserts, setDeserts] = useState([]);
  const [milkshakes, setMilkshakes] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://dikshi.ddns.net/reacttest/api/Foodorder')
      .then(response => {
        const data = response.data;
        setMainCourse(data.filter(item => item.category === "Main Course"));
        setStarters(data.filter(item => item.category === "Starter"));
        setDeserts(data.filter(item => item.category === "Deserts"));
        setMilkshakes(data.filter(item => item.category === "Milkshakes"));
      })
      .catch(error => {
        console.error('Error fetching food items:', error);
      });
  }, []);

  const updateQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta)
    }));
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] ?? 0;
    if (quantity === 0) return Alert.alert('Add quantity before adding to cart.');

    const index = cart.findIndex(cartItem => cartItem.id === item.id);
    let updatedCart;
    if (index !== -1) {
      updatedCart = [...cart];
      updatedCart[index].quantity += quantity;
    } else {
      updatedCart = [...cart, { ...item, quantity }];
    }
    setCart(updatedCart);
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
    Alert.alert(`${item.dish} added to cart (${quantity})`);
  };

  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };
  const List = ({ items }) => (
    <>
      {items.map((item) => (
        <View key={4} style={styles.foodItem}>
          <Image source={{ uri: item.imageUrl }} style={styles.image1} />
        </View>
      ))}
    </>
  );



  const renderFoodList = (items) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((item) => (

        <View key={item.id} style={styles.foodItem}>
          <Image source={{ uri: item.imageUrl }} style={styles.image1} />
          <Text style={styles.foodName}>{item.dish}</Text>
          <Text style={styles.foodPrice}>₹{item.price}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyButton}>
              <Text style={styles.qtyText}>–</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantities[item.id] ?? 0}</Text>
            <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyButton}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => addToCart(item)} style={styles.addToCartButton}>
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const handleSearchSubmit = () => {
    const query = searchQuery.trim().toLowerCase();
    const allItems = [...mainCourse, ...starters, ...deserts, ...milkshakes];
    const filtered = allItems.filter(item =>
      item.dish.toLowerCase().includes(query)
    );

    navigation.navigate('SearchResults', {
      results: filtered,
      cart,
      updateCart: setCart,
      clearCart
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ꉓꃅꀤꀘꀎ ꌗꉣꂦ꓄..🐣</Text>

      <TextInput
        style={{
          backgroundColor: 'white',
          width: '90%',
          padding: 10,

          borderRadius: 10,
          marginBottom: 10
        }}
        placeholder="Search for dishes..."
        placeholderTextColor={'#888'}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
      />
      <AutoScrollCarousel />

      <ScrollView>
        <Text style={styles.section}>Main course</Text>
        {renderFoodList(mainCourse)}

        <Text style={styles.section}>Starters</Text>
        {renderFoodList(starters)}

        <Text style={styles.section}>Deserts</Text>
        {renderFoodList(deserts)}

        <Text style={styles.section}>Milkshakes</Text>
        {renderFoodList(milkshakes)}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('Cart', { cart, updateCart: setCart, clearCart })}
        style={styles.fixedCartButton}
      >
        <Text>Go to Cart ({cart.reduce((a, item) => a + item.quantity, 0)})</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', alignItems: 'center' },
  header: { padding: 20, marginTop: 50, color: 'white', fontSize: 35, fontWeight: 'bold' },
  section: {

    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 20,
    alignSelf: 'flex-start',

  },
  image1: { width: 200, height: 200, marginTop: 20, borderRadius: 20 },
  foodItem: { alignItems: 'center', marginHorizontal: 20 },
  foodName: { color: 'white', marginTop: 10, fontSize: 18, fontWeight: 'bold' },
  foodPrice: { color: '#ccc', fontSize: 16 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  qtyButton: {
    backgroundColor: 'grey',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 5,
    borderRadius: 5
  },
  qtyText: { color: 'white', fontSize: 16 },
  addToCartButton: {
    backgroundColor: 'yellow',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
    borderRadius: 5
  },
  cartText: { color: 'black', fontWeight: 'bold' },
  fixedCartButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignSelf: 'flex-end'
  },
});

export default HomePage;
