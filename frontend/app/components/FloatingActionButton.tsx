import { TouchableOpacity, Text, Animated } from "react-native";
import { useRef, useState } from "react";

interface FloatingActionButtonProps {
    onAddTrashcan: () => void;
    onAddRestroom: () => void;
}

const FloatingActionButton = ({
    onAddTrashcan,
    onAddRestroom,
}: FloatingActionButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const slideAnim1 = useRef(new Animated.Value(0)).current;
    const slideAnim2 = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        if (isOpen) {
            // 닫기 애니메이션
            Animated.parallel([
                Animated.timing(slideAnim1, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim2, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // 열기 애니메이션
            Animated.parallel([
                Animated.timing(slideAnim1, {
                    toValue: -80,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim2, {
                    toValue: -140,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
        setIsOpen(!isOpen);
    };

    const handleAddTrashcan = () => {
        onAddTrashcan();
        toggleMenu();
    };

    const handleAddRestroom = () => {
        onAddRestroom();
        toggleMenu();
    };

    return (
        <>
            {/* 쓰레기통 버튼 - 위쪽에 */}
            {isOpen && (
                <TouchableOpacity
                    className="
            absolute bottom-46 right-6
            w-14 h-14 rounded-full bg-slate-300
            justify-center items-center
            shadow-md shadow-gray-500
          "
                    onPress={handleAddTrashcan}
                >
                    <Text className="text-white text-lg">🗑️</Text>
                </TouchableOpacity>
            )}

            {/* 화장실 버튼 - 위쪽에 */}
            {isOpen && (
                <TouchableOpacity
                    className="
            absolute bottom-26 right-6
            w-14 h-14 rounded-full bg-blue-300
            justify-center items-center
            shadow-md shadow-gray-500
          "
                    onPress={handleAddRestroom}
                >
                    <Text className="text-white text-lg">🚻</Text>
                </TouchableOpacity>
            )}

            {/* 메인 FAB 버튼 */}
            <TouchableOpacity
                className="
          absolute bottom-6 right-6
          w-14 h-14 rounded-full bg-blue-500
          justify-center items-center
          shadow-md shadow-gray-500
        "
                onPress={toggleMenu}
            >
                <Text className="text-white text-2xl font-bold">
                    {isOpen ? '×' : '+'}
                </Text>
            </TouchableOpacity>
        </>
    )
}

export default FloatingActionButton;