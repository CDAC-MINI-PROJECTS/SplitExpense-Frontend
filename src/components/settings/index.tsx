import { Separator } from '@/components/ui/separator'
import Header from '@/components/header';
import SidebarNav from './components/sidebar-nav'
import BottomNav from '@/components/bottom-nav';
import RootLayout from "../../pages/layout";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from 'react-router-dom';
import { onMessage } from "firebase/messaging";
import { useToast } from "@/components/ui/use-toast.js";
import { Loader2, User, Wrench, Palette, AppWindow } from 'lucide-react'
import SettingsAccount from './account/index.js';
import SettingsAppearance from './appearance/index.js';
import SettingsDisplay from './display/index.js';
import SettingsProfile from './profile/index.js';

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user_id, setUserID] = useState(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [verified, setVerified] = useState(false);
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(true);
  const { page } = useParams();
  const sidebarNavItems = [
    {
      title: 'Profile',
      icon: <User size={18} />,
      href: '/settings',
    },
    {
      title: 'Account',
      icon: <Wrench size={18} />,
      href: '/settings/account',
    },
    {
      title: 'Appearance',
      icon: <Palette size={18} />,
      href: '/settings/appearance',
    },
    {
      title: 'Display',
      icon: <AppWindow size={18} />,
      href: '/settings/display',
    },
  ]

  useEffect(() => {
    setLoading(true);
    // verifyUser();
    setLoading(false);
  }, [Cookies]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  return (
  <RootLayout>
      <div className="min-h-screen bg-background text-foreground">
        <Header activeTab="#" username={username} name={name} profile={profile} verified={verified}/>
        <div className="container pt-4 pl-4">
        <div className='space-y-0.5'>
          <h1 className='lg:text-[20px] font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set preferences.
          </p>
        </div>
        <Separator orientation="horizontal" className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
            { page === "account" && user_id != undefined ? (
              <SettingsAccount />
            ) : page === "appearance" ? (
              <SettingsAppearance />
            ) : page === "display" ? (
              <SettingsDisplay />
            ) : (
              user_id != undefined &&
              <SettingsProfile user_id={user_id} name={name} username={username} />
            )}
          </main>
        </div>
        </div>
        <BottomNav user_id={user_id} username={username} name={name} profile={profile} verified={verified}/>
      </div>
 </RootLayout>  
  )
}