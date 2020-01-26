import { useLanguage } from '../../hooks'

export function useFooterArrangement() {
  const content = useLanguage()
  return [
    {
      category: content.sidebar.navigation,
      items: [
        {
          title: content.sidebar.register,
          link: '/register',
        },
        {
          title: content.sidebar.landingPage,
          link: '/',
        },
      ],
    },
    {
      category: content.sidebar.development,
      items: [
        {
          title: 'Plugin Development',
          link: '/pages/plugins',
        },
        {
          title: 'Github',
          link: 'https://github.com/blicc-org/blicc',
        },
        {
          title: 'OpenAPI 3.0 docs',
          link: 'https://api.blicc.org',
        },
        {
          title: 'Data Delivery docs',
          link: 'https://delivery.blicc.org',
        },
      ],
    },
    {
      category: content.sidebar.about,
      items: [
        {
          title: 'Manual',
          link: '/pages/manual',
        },
        {
          title: content.sidebar.imprint,
          link: '/pages/imprint',
        },
      ],
    },
  ]
}
