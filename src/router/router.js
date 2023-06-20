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
        path: '/teammate/context',
        name: 'Context',
        component: ContextView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/teammate/conversation',
        name: 'Conversation',
        component: ChatView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/teammate/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/teammate/register',
        name: 'Register',
        component: RegisterView
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/teammate/context'
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/teammate/login'); 
    } else {
        next();
    }
});

export default router