import { getNotification, markToRead } from '@/api/Notification';
import Header from '@/components/Header';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { useUserContext } from '@/context/UserContext';
import { INotification } from '@/interface/Notification';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Notifications = () => {
    const { user } = useUserContext();
    const { token } = useToken();
    const { setLoading } = useLoading();
    const [read, setRead] = useState<INotification[] | null>([]);
    const [unRead, setUnRead] = useState<INotification[] | null>([]);
    const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
    useEffect(() => {
        const loadNotifiaction = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const id =user?.Sells && user?.Sells[0].id;
                const { data } = await getNotification({ token, id:Number(id) });
                setUnRead(data.filter((n: INotification) => !n.read));
                setRead(data.filter((n: INotification) => n.read));
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        loadNotifiaction();
    }, [!unRead]);

    const renderItem = ({ item }: { item: INotification }) => (
        <View style={styles.notificationItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMessage}>{item.message}</Text>
            </View>
            {!item.read && (
                <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => markRead(Number(item.id))}
                >
                    <Text style={styles.readButtonText}>✓ Leído</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const markRead = async (id: number) => {
        setLoading(true);
        try {
            await markToRead({ id, token });
            Alert.alert('Leido', 'Comentario marcado como leido.')
            setUnRead(null);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Header title="Notificaciones" isLoggedIn={true} user={user} />
            <View style={styles.container}>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
                        onPress={() => setActiveTab('unread')}
                    >
                        <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
                            No leídos ({unRead && unRead.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'read' && styles.activeTab]}
                        onPress={() => setActiveTab('read')}
                    >
                        <Text style={[styles.tabText, activeTab === 'read' && styles.activeTabText]}>
                            Leídos ({read && read.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Lista scrollable */}
                <FlatList
                    data={activeTab === 'unread' ? unRead : read}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={{paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#007aff',
    },
    tabText: {
        fontSize: 15,
        color: '#666',
    },
    activeTabText: {
        color: '#007aff',
        fontWeight: '600',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    itemMessage: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    readButton: {
        backgroundColor: '#e0f2ff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 10,
    },
    readButtonText: {
        fontSize: 13,
        color: '#007aff',
        fontWeight: '500',
    },
});

export default Notifications