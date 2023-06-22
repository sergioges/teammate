import {
    createRouter,
    createWebHistory
} from 'vue-router'
import jwt_decode from 'jwt-decode'
import ContextView from '@/views/ContextView.vue'
import ChatView from '@/views/ChatView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

function isAuthenticated() {
    const token = sessionStorage.getItem('chatgpt-token');

    if (token) {
        try {
            const decoded = jwt_decode(token);
            const currentTime = Date.now() / 1000;

            return decoded.exp > currentTime;
        } catch (error) {
            return false; // Si ocurre algún error al decodificar el token, se considera inválido
        }
    }

    return false;
}

const routes = [{
        path: '/context',
        name: 'Context',
        component: ContextView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/conversation',
        name: 'Conversation',
        component: ChatView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/context'
    },
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.VITE_BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/login'); 
    } else {
        next();
    }
});

export default router