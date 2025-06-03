import React, { useEffect, useRef, useState } from 'react';

import { ScrollView, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

const AutoScrollCarousel = () => {
  const [images, setImages] = useState([]);
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch carousel images from your backend
    fetch('http://dikshi.ddns.net/reacttest/api/Foodorder/carousel')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error('Carousel fetch error:', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 1000); // 3-second interval

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
      scrollEnabled={false} // disables manual swipe
      style={{ width, height: 200, marginBottom: 20 }}
    >
      {images.map((item, idx) => (
        <Image
          key={idx}
          source={{ uri: item.imageUrl }}
          style={{ width, height: 200, resizeMode: 'cover', borderRadius: 10 }}
        />
      ))}
    </ScrollView>
  );
};

export default AutoScrollCarousel;
