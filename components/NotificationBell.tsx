import { getNotRead } from '@/api/Notification';
import { useToken } from '@/context/TokenContext';
import { useUserContext } from '@/context/UserContext';
import { INotification } from '@/interface/Notification';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { io } from 'socket.io-client';


const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const { user } = useUserContext();
    const { token } = useToken();
    const API_URL = process.env.EXPO_PUBLIC_API_SERVER;
    const socket = io(API_URL);
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                if (!user || !user.Sells) {
                    return;
                }
                const { data } = await getNotRead({ sellId: user.Sells[0].id ?? 0, token })
                setNotifications(data);
            } catch (error) {
                console.log(error);
            }
        }

        Animated.timing(fadeAnim, {
            toValue: open ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
        socket.on('client', (data) => {
            console.log(data);
            loadNotifications();
        })
        return () => {
            socket.off('admin');
        };
    }, [open]);


    return (
        <View>
            <TouchableOpacity onPress={() => setOpen(!open)} style={styles.bellButton}>
                <Ionicons name="notifications-outline" size={24}
                    color={notifications && notifications.length > 0 ? 'red' : "white"} />
                {notifications && notifications.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{notifications.length}</Text>
                    </View>
                )}
            </TouchableOpacity>

            {open && notifications.length > 1 && (
                <Animated.View style={[styles.panel, { opacity: fadeAnim }]}>
                    <Text style={styles.panelTitle}>📬 Comentarios</Text>
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => {
                                    setOpen(false);
                                    // Aquí puedes navegar a la pantalla de perfil o detalle
                                    // Ejemplo: router.navigate('/screen/ProfileScreen');
                                }}
                            >
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemMessage}>{item.message}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1
    },
    bellButton: {
        padding: 0,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'red',
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
    },
    panel: {
        position: 'absolute',
        top: 40,
        right: 0,
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100,
    },
    panelTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    item: {
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemTitle: {
        fontWeight: '600',
    },
    itemMessage: {
        fontSize: 12,
        color: '#555',
    },
});
export default NotificationBell;