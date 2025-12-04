import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useTranslation } from 'react-i18next';

interface CourseSelectionModalProps {
    visible: boolean;
    courseTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function CourseSelectionModal({
    visible,
    courseTitle,
    onConfirm,
    onCancel,
}: CourseSelectionModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{t('courses.switchCourseTitle', 'Switch Course?')}</Text>
                    <Text style={styles.message}>
                        {t('courses.switchCourseMessage', 'Switching to {{course}} will reset your current vocabulary progress. Are you sure?', { course: courseTitle })}
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>{t('common.cancel', 'Cancel')}</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>{t('common.confirm', 'Confirm')}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 20,
        color: Colors.ink,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.paper,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    confirmButton: {
        backgroundColor: Colors.thaiGold,
    },
    cancelButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.taupe,
    },
    confirmButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.white,
    },
});
