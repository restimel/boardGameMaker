// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    components: true,
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Boardgame Maker',
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/logo.svg' }],
        },
        pageTransition: { name: 'page', mode: 'out-in' },
    },
    routeRules: {
        '/': { redirect: { to: '/summary', statusCode: 302 }},
    },
});
