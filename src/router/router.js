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

const conversationPath = import.meta.env.VITE_IS_LOCAL === "True" ? '/conversation' : '/';
const landingPath = import.meta.env.VITE_IS_LOCAL === "True" ? '/' : '/welcome';

const routes = [{
        path: '/context',
        name: 'Context',
        component: ContextView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: conversationPath,
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
        path: landingPath,
        name: 'Landing',
        component: LandingView
    },
    {
        path: '/:pathMatch(.*)',
        redirect: landingPath
    },
]

let router;

if (import.meta.env.VITE_IS_LOCAL === "True") {
    router = createRouter({
        history: createWebHistory(),
        routes
    })
    router.beforeEach((to, from, next) => {
        if (to.meta.requiresAuth && !isAuthenticated()) {
            next('/');
        } else {
            next();
        }
    });
} else {
    router = createRouter({
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
}



export default router