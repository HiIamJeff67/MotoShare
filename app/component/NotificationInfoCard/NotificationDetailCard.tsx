import { Theme } from '@/theme/theme';
import React from 'react';
import { Animated, Image, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { NotificationDetailCardStyles } from './NotificationDetailCard.style';
import { UserNotificationDetailInterface } from '@/interfaces/userNotificationDetail.interface';
import LoadingWrapper from '../LoadingWrapper/LoadingWrapper';

export interface NotificationDetailCardProps {
    notificationDetail: UserNotificationDetailInterface;
    isDataLoading: boolean;
    onClose: () => void;
    theme: Theme;
}

const NotificationDetailCard = (props: NotificationDetailCardProps) => {
    const styles = NotificationDetailCardStyles(props.theme);
    const item = props.notificationDetail;

    return (
        <Animated.View style={styles.overlay} onTouchEnd={props.onClose}>
            <Animated.View style={styles.container} onTouchEnd={(e) => e.stopPropagation()}>
                {props.isDataLoading || !item
                    ? <LoadingWrapper />
                    : (<Animated.View style={styles.innerContainer}>
                        <Animated.View style={styles.header}>
                            <Animated.Text style={styles.title}>{item.title}</Animated.Text>
                        </Animated.View>
                        <Animated.ScrollView style={styles.body}>
                            <Animated.View style={styles.descriptionContainer}>
                                <Animated.Text style={styles.descriptionTitle}>Description:</Animated.Text>
                                <Animated.Text style={styles.description}>{item.description}</Animated.Text>
                            </Animated.View>
                            <Animated.View style={styles.linkContainer}>
                                <Animated.Text style={styles.linkTypeTitle}>{`NotificationType: `}
                                    <Animated.Text style={styles.linkTypeContent}>{item.notificationType}</Animated.Text>
                                </Animated.Text>
                                <Animated.Text style={styles.linkIdTitle}>{`link: `}
                                    <Animated.Text style={styles.linkIdContent}>{item.linkId}</Animated.Text>
                                </Animated.Text>
                            </Animated.View>
                            <Animated.Text style={styles.createdAtTitle}>
                                <Animated.Text style={styles.createdAtContent}>
                                    {new Date(item.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Taipei" })}
                                </Animated.Text>
                            </Animated.Text>
                            {!item.isRead && <Image style={styles.isRead} source={require('../../../assets/images/new.png')} />}
                        </Animated.ScrollView>
                      </Animated.View>)
                }
            </Animated.View>
        </Animated.View>
    );
}

export default NotificationDetailCard;