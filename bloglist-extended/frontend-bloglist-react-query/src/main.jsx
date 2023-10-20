import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './context/notificationContext'
import { BlogsContextProvider } from './context/blogContext'
import { LoginContextProvider } from './context/loginContext'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
<QueryClientProvider client={queryClient}>
    <LoginContextProvider>
        <BlogsContextProvider>
            <NotificationContextProvider>
                <App />
            </NotificationContextProvider>
        </BlogsContextProvider>
    </LoginContextProvider>
</QueryClientProvider>
)
