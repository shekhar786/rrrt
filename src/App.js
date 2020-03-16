import React, { PureComponent } from 'react';
import { StatusBar, Linking } from 'react-native';
import { Provider } from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import firebase from 'react-native-firebase';
import queryString from 'query-string';

import store from './store';
import AppNavigator from './navigation/AppNavigator';
import { setTopLevelNavigator } from './utilities/NavigationService';
import logger from './utilities/logger';
import { layout } from './utilities/layout';
import { getAppdata } from './utilities/constants';

class App extends PureComponent {
	componentDidMount() {
		this.bootstrapApp();

		// firebase.messaging().getToken().then((token) => console.log('token:', token));
		//to handle dynamic links opened from anywhere when app is opened
		this.unsubscribeFirebaseDynamicLink = firebase.links().onLink(this.handleDynamicLink);

		this.createNotificationListeners();
		this.requestNotificationPermissions();
	}

	componentWillUnmount() {
		this.unsubscribeFirebaseDynamicLink();

		this.notificationListener();
	}

	requestNotificationPermissions = async () => {
		try {
			const enabled = await firebase.messaging().hasPermission();
			if (!enabled) {
				await firebase.messaging().requestPermission();
			}
		} catch (error) {
			logger.error('Request push notifiction error :', error);
		}
	};

	createNotificationListeners = async () => {
		const channel = new firebase.notifications.Android.Channel(
			getAppdata().channelId,
			getAppdata().channelName,
			firebase.notifications.Android.Importance.Max
		)
			.setDescription(getAppdata().channelDiscription);
		// Create the channel
		firebase.notifications().android.createChannel(channel);

        /*
        * Triggered when a particular notification has been received in foreground
        * */

		this.notificationListener = firebase.notifications()
			.onNotification(async (notification) => {
				return
				logger.log('Notification received in foreground is: ', notification);

				try {
					const tempNotification = new firebase.notifications.Notification()
						.setNotificationId(notification.notificationId)
						.setTitle(notification.title)
						.setBody(notification.data['gcm.notification.message'])
						.setData(notification.data)
						.android.setChannelId(channel.channelId);

					await firebase.notifications().displayNotification(tempNotification);
					logger.log('local notification created successfully: ');
				} catch (error) {
					logger.error('Local push generation error', error);
				}
			});

        /*
        * If your app is in background, you can listen for when a
        * notification is clicked / tapped / opened as follows:
        * */
		this.notificationOpenedListener = firebase.notifications()
			.onNotificationOpened(async (bgNotification) => {
				logger.log('Notification received in background', bgNotification);
			});

        /*
        * If your app is closed, you can check if it was opened by a notification being
        * clicked / tapped / opened as follows:
        * */
		const notificationOnKilledApp = await firebase.notifications().getInitialNotification();

		if (notificationOnKilledApp) {
			logger.log(
				'app opened by notification',
				notificationOnKilledApp.notification.data
			);
		}
        /*
        * Triggered for data only payload in foreground
        * */
		this.messageListener = firebase.messaging().onMessage(async (message) => {
			return
			//process data message
			logger.log('data only notification', message);

			try {
				const tempNotification = new firebase.notifications.Notification()
					.setNotificationId(message.messageId)
					.setTitle(message.data.title)
					.setBody(String(message.data.body))
					.setData(message.data)
					.android.setChannelId(channel.channelId);

				await firebase.notifications().displayNotification(tempNotification);
				logger.log('local notification created successfully: ');
			} catch (error) {
				logger.error('Local push generation error', error);
			}
		});
	};

	/* to handle dynamic links opened from anywhere when app was
	launched (or even installed first) as a result of following a dynamic link */
	bootstrapApp = async () => {
		try {
			const link = await firebase.links().getInitialLink();

			console.log('link: ', link);

			const initialLink = await firebase.links()
				.getInitialLink();

			console.log('initialLink from killed app: ', initialLink);

			if (initialLink) {
				logger.log('initial link is: ', initialLink);

				const parsedUrl = queryString.parseUrl(initialLink);

				logger.log('parsedUrl: ', parsedUrl);

				/* if (parsedUrl.query.productId) {
					navigate(screenNames.ProductDetails);
				} */
			}
		} catch (error) {
			logger.error('getInitialLink error: ', error);
		}
	};

	handleDynamicLink = link => {
		console.log('Dynamic link executed:', JSON.stringify(link));

		if (link) {
			logger.log('dynamic link while app is opened, is: ', link);
			const parsedUrl = queryString.parseUrl(link);

			logger.log('parsedUrl: ', parsedUrl);

			/* if (parsedUrl.query.productId) {
				navigate(screenNames.ProductDetails);
			} */
		} else if (!layout.isIOS) { //android
			Linking.getInitialURL()
				.then((url) => {
					console.log('dynamic link whike app is opened(Linking), is: ', url);
				})
				.catch(err => logger.error('Opening dynamic link error: ', err));
		} else {
			// handle case for iOS
			logger.log('Link to be handled for iOS');
		}
	};

	render() {
		return (
			<Provider store={store}>
				<StatusBar
					translucent
					backgroundColor={'transparent'}
				/>

				<AppNavigator
					ref={navigatorRef => setTopLevelNavigator(navigatorRef)}
				/>

				<FlashMessage position={'top'} />
			</Provider>
		);
	}
}

export default App;
