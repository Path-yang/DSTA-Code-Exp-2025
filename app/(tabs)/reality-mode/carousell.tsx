import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Button,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    Image,
} from 'react-native';
import { router } from 'expo-router';
import { ScoreContext } from './_ScoreContext';

type Product = {
    id: string;
    name: string;
    price: string;
    seller: string;
    description: string;
    isScam: boolean;
    image?: any;
};

const productListings: Product[] = [
    {
        id: '1',
        name: 'AirPods Pro – 90% OFF!',
        price: '$19.99',
        seller: 'TechZone_Promo',
        description: 'Unbelievable deal! Pay via Venmo to secure.',
        isScam: true,
        image: require('@/assets/images/carousell-airpods-pro.jpg'),
    },
    {
        id: '2',
        name: 'Nike Dunk Low',
        price: '$159.99',
        seller: 'SneakerWorld',
        description: 'Brand new, Size US 7. Pay on delivery.',
        isScam: false,
        image: require('@/assets/images/carousell-nike-sneakers.png'),
    },
    {
        id: '3',
        name: 'iPhone 15 Pro Max',
        price: '$399.00',
        seller: 'CertifiedMobilez',
        description:
            'Pay now via Bitcoin and get overnight shipping. Limited quantity!',
        isScam: true,
        image: require('@/assets/images/carousell-iphone-15-pro-max.jpeg'),
    },
    {
        id: '4',
        name: 'Secretlab TITAN Evo',
        price: '$629.00',
        seller: 'GameFurniture',
        description: 'Our most technologically advanced chair yet. With multiple patent-pending features that adapt to support you across a wide variety of tasks and postures, Secretlab TITAN Evo is engineered for the ultimate in tailored ergonomic support.',
        isScam: false,
        image: require('@/assets/images/carousell-gaming-chair.png'),
    },
];

export default function RealityModeCarousell() {
    const { addScore, showPointsPopup, respondedProducts, addRespondedProduct } = useContext(ScoreContext);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const handleBack = () => router.back();

    const handleDecision = (action: 'report' | 'trust') => {
        if (!selectedProduct) return;

        let message = '';
        let points = 0;

        if (action === 'report') {
            if (selectedProduct.isScam) {
                message = '✅ Good catch! That was a scam listing.';
                points = 10;
            } else {
                message = '❌ Oops. That listing was safe.';
                points = -5;
            }
        } else if (action === 'trust') {
            if (selectedProduct.isScam) {
                message = '🚨 Warning! That was a scam. Never pay with untraceable methods.';
                points = -10;
            } else {
                message = '✅ Correct. This was a safe seller.';
                points = 10;
            }
        }

        addScore(points);
        showPointsPopup(points);
        setFeedback(message);
        addRespondedProduct(selectedProduct.id);
        setSelectedProduct(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backText}>{'< Back'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Carousell</Text>

            <FlatList
                data={productListings.filter(product => !respondedProducts.has(product.id))}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.productItem}
                        onPress={() => setSelectedProduct(item)}
                    >
                        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                        {item.image && (
                            <Image source={item.image} style={styles.productImage} />
                        )}
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>{item.price}</Text>
                            <Text style={styles.seller} numberOfLines={1}>by {item.seller}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <Modal visible={!!selectedProduct} transparent animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        {selectedProduct && (
                            <>
                                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                                <Text style={styles.modalDesc}>{selectedProduct.description}</Text>
                                <View style={styles.buttonRow}>
                                    <Button title="✅ Trust Listing" onPress={() => handleDecision('trust')} />
                                    <Button title="🚨 Report Scam" color="crimson" onPress={() => handleDecision('report')} />
                                </View>
                                <Button title="Close" onPress={() => setSelectedProduct(null)} />
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {feedback && (
                <View style={styles.feedbackBox}>
                    <Text>{feedback}</Text>
                    <Button title="OK" onPress={() => setFeedback(null)} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f7fa' },
    backButton: { marginBottom: 10 },
    backText: { color: '#007AFF', fontSize: 16, marginLeft: 10 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginLeft: 10 },
    gridContainer: {
        paddingHorizontal: 5,
        justifyContent: 'space-between'
    },
    productItem: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 5,
        borderRadius: 12,
        elevation: 3,
        width: '47%',
        aspectRatio: 0.70,
        justifyContent: 'space-between',
    },
    productImage: {
        width: '100%',
        height: '65%',
        borderRadius: 8,
        marginVertical: 5,
    },
    name: { fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
    priceContainer: {
        alignItems: 'center',
    },
    price: { fontSize: 16, fontWeight: '600', color: '#e74c3c', textAlign: 'center', marginBottom: 5 },
    seller: { fontSize: 12, color: '#666', textAlign: 'center' },
    modalBackground: {
        flex: 1,
        backgroundColor: '#00000088',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        width: '85%',
        borderRadius: 12,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalDesc: { marginBottom: 20 },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
        gap: 10,
    },
    feedbackBox: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        elevation: 5,
        alignItems: 'center',
    },
}); 