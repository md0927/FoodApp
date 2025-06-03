import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import axios from 'axios';

const { width } = Dimensions.get('window');

const AutoScrollCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://dikshi.ddns.net/reacttest/api/food/carousel')
      .then(response => {
        setImages(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading carousel images:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 10 }} />;
  }

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        width={width * 0.9}
        height={200}
        autoPlay
        loop
        data={images}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
});

export default AutoScrollCarousel;
