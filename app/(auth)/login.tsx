import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../src/stores/languageStore";
import { useUserStore } from "../../src/stores/userStore";
import { useState } from "react";
import Button from "../../src/components/common/Button";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';

/*
 * 登录页面组件
 * 功能:
 * 1. 邮箱/密码登录
 * 2. 多语言切换
 * 3. 表单验证
 * 4. 错误提示
 */

export default function LoginPage() {
    //======= hook ======
    const { t } = useTranslation(); // 从 i18n 实例中获取翻译函数
    const router = useRouter();  // 获取路由实例
    const { currentLanguage, changeLanguage } = useLanguageStore();  // 从状态管理获取当前语言和切换语言函数
    const { login } = useUserStore();  // 从状态管理获取登录函数

    //======= local state ======
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    /*
     * 表单验证函数
     * @returns {boolean} 是否验证通过
     */
    const validateForm = () => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;          //Regex是一个正则表达式对象,用于匹配字符串中的模式
        if (!email) {
            newErrors.email = t('auth.validation.emailRequired') || '邮箱不能为空';
            isValid = false;
        } else if (!emailRegex.test(email)) {                     //test() 方法是emailRegex对象的一个方法,用于检测一个字符串是否匹配某个模式
            newErrors.email = t('auth.validation.emailInvalid');
            isValid = false;
        }


        // 验证密码
        if (!password) {
            newErrors.password = t('auth.validation.passwordRequired') || '密码不能为空';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = t('auth.validation.passwordTooShort');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    /*
     * 【核心函数2】处理登录
     * 流程:
     * 1. 验证表单
     * 2. 调用 login 方法
     * 3. 成功 → 跳转, 失败 → 提示
   */
    const handleLogin = async () => {
        // 验证表单
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // 调用 Zustand 的 login 方法
            const success = await login(email, password);

            if (success) {
                // 登录成功,跳转到主页
                router.replace('/(tabs)');
            } else {
                // 登录失败,显示错误
                Alert.alert(
                    t('common.error'),
                    t('auth.errors.loginFailed')
                );
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert(
                t('common.error'),
                t('auth.errors.loginFailed')
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 【核心函数3】切换语言
     */
    const toggleLanguage = () => {
        const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
        changeLanguage(newLang);
    };

    /*
        以上函数为登录页面的核心函数，主要负责：
        1. 验证表单输入：
            - 检查邮箱格式是否有效（首先const一个emailRegex设置邮箱格式，然后使用if（!email）判断email是否为空，
                再使用if（!emailRegex.test(email）判断email是否符合emailRegex格式）
            - 检查密码是否符合要求（同样适用if方法，判断password是否为空，再判断password长度是否至少8个字符）
        2. 处理登录请求
            首先使用if（!validateForm()）判断表单是否验证通过，若未通过则直接返回，若通过则继续，
            然后在验证表单后，使用try...catch...finally方法处理登录请求，
            try中通过const success 调用调用 Zustand 的 login 方法进行登录验证，
            然后使用if来验证success是否为true，
            若为true则跳转到主页，若为false则显示错误提示并catch错误，finally中设置isLoading为false）
        3. 切换语言
            - 调用 Zustand 的 changeLanguage 方法切换语言
    */

    return (
        <KeyboardAvoidingView  // 在 iOS 上,键盘弹起会遮挡输入框,使用<KeyboardAvoidingView>组件后内容会自动上移，避免被键盘遮挡
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* 语言切换按钮 */}
            <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                <Text style={styles.languageText}>
                    {currentLanguage === 'zh' ? '🇨🇳 中文' : '🇺🇸 English'}
                </Text>
            </TouchableOpacity>

            <View style={styles.content}>
                {/* 标题 */}
                <Text style={styles.title}>{t('auth.login')}</Text>
                <Text style={styles.subtitle}>
                    {t('home.subtitle') || '继续你的泰语学习之旅'}
                </Text>

                {/* 邮箱输入 */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('auth.email')}</Text>
                    <TextInput
                        style={[styles.input, errors.email ? styles.inputError : null]}
                        placeholder={t('auth.emailPlaceholder')}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors({ ...errors, email: '' });  // 清除错误
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {errors.email ? (
                        <Text style={styles.errorText}>{errors.email}</Text>
                    ) : null}
                </View>

                {/* 密码输入 */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{t('auth.password')}</Text>
                    <TextInput
                        style={[styles.input, errors.password ? styles.inputError : null]}
                        placeholder={t('auth.passwordPlaceholder')}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrors({ ...errors, password: '' });
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    {errors.password ? (
                        <Text style={styles.errorText}>{errors.password}</Text>
                    ) : null}
                </View>

                {/* 登录按钮 */}
                <Button
                    title={isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
                    onPress={handleLogin}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.loginButton}
                />

                {/* 注册提示(未来功能) */}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>{t('auth.noAccount')}</Text>
                    <TouchableOpacity>
                        <Text style={styles.registerLink}>{t('auth.register')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    languageButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    languageText: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
    },
    loginButton: {
        marginTop: 10,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        color: '#666',
        fontSize: 14,
    },
    registerLink: {
        color: '#4A90E2',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
})