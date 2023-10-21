import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './context/notificationContext'
import { BlogsContextProvider } from './context/blogContext'
import { LoginContextProvider } from './context/loginContext'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/usersContext'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserContextProvider>
        <LoginContextProvider>
          <BlogsContextProvider>
            <NotificationContextProvider>
              <App />
            </NotificationContextProvider>
          </BlogsContextProvider>
        </LoginContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
