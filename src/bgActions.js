// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type { NotificationOpen } from 'react-native-firebase';

import { getAppdata } from './utilities/constants';

export default async (notification: NotificationOpen) => {
    console.log('notificationOpen: ', notification);

    const tempNotification = new firebase.notifications.Notification()
        .setNotificationId(notification.messageId)
        .setTitle(notification.data.title)
        .setBody(String(notification.data.body))
        .setData(notification.data)
        .android.setChannelId(getAppdata().channelId)
        .android.setPriority(2);

    await firebase.notifications().displayNotification(tempNotification);

    console.log('local notification created successfully: ');

    if (notification.action === 'snooze') {
        // handle the action
        // Set up your listener
        firebase.notifications().onNotificationOpened((notificationOpen) => {
            // notificationOpen.action will equal 'snooze'
        });

        // Build your notification
        const notificationMessage = new firebase.notifications.Notification()
            .setTitle('Android Notification Actions')
            .setBody('Action Body')
            .setNotificationId('notification-action')
            .setSound('default')
            .android.setChannelId('notification-action')
            .android.setPriority(firebase.notifications.Android.Priority.Max);
        // Build an action
        const action = new firebase.notifications.Android.Action('snooze', 'ic_launcher', 'My Test Action');
        // This is the important line
        action.setShowUserInterface(false);
        // Add the action to the notification
        notificationMessage.android.addAction(action);

        // Display the notification
        firebase.notifications().displayNotification(notificationMessage);
    }

    return Promise.resolve();
};
