import {
    createRouter,
    createWebHistory,
    createMemoryHistory
} from 'vue-router'
import { isAuthenticated } from "@/mixin/AuthToken";
import ContextView from '@/views/ContextView.vue'
import ChatView from '@/views/ChatView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import GalleryView from '@/views/GalleryView.vue'
import LandingView from '@/views/LandingView.vue'

const routes = [{
        path: '/context',
        name: 'Context',
        component: ContextView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/',
        name: 'Conversation',
        component: ChatView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: GalleryView,
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
        path: '/welcome',
        name: 'Landing',
        component: LandingView
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/welcome'
    },
]

const router = createRouter({
    history: (createWebHistory(
        import.meta.env.VITE_BASE_URL), createMemoryHistory()),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/welcome'); 
    } else {
        next();
    }
});

export default router