import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        (async () => {
            setIsLoading(true);

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('위치 권한이 거부되었습니다.');
                setIsLoading(false);
                return;
            }

            // 🔥 Get immediate location FIRST
            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Lowest
            });
            setLocation(currentLocation);
            setIsLoading(false);

            // Then start watching for updates
            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    distanceInterval: 10,
                    timeInterval: 5000, // Updates every 5 seconds
                },
                (newLocation) => {
                    setLocation(newLocation);
                }
            );
        })();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return { location, error, isLoading };
}