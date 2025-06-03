import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

const AutoScrollCarousel = () => {
  const [images, setImages] = useState([]);
  const scrollRef = useRef(null);
  const currentIndexRef = useRef(0); // keep track of index without triggering re-render

  useEffect(() => {
    fetch('http://dikshi.ddns.net/reacttest/api/Foodorder/carousel')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error('Carousel fetch error:', err));
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      currentIndexRef.current = nextIndex;
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
      scrollEnabled={false}
      style={{ width, height: 500, marginBottom: 20 }}
    >
      {images.map((item, idx) => (
        <Image
          key={idx}
          source={{ uri: item.imageUrl }}
          style={{ width:350, height: 200,marginLeft:15,marginRight:20, resizeMode: 'cover', borderRadius: 10 }}
        />
      ))}
    </ScrollView>
  );
};

export default AutoScrollCarousel;
