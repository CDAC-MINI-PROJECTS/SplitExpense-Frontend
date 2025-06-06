import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/header.js';
import SideNav from '../components/side-nav.js';
import Sidebar from '../components/trendings.js';
import { Skeleton } from "@/components/ui/skeleton"
import FollowSuggestions from '../components/follow-suggestions.js';
import BottomNav from '../components/bottom-nav.js';
import { Loader2, Bug, RotateCw } from 'lucide-react';
import RootLayout from "./layout.js";
import { onMessage } from "firebase/messaging";
import { useToast } from "@/components/ui/use-toast.js";
import Post from '../components/post.js'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

export default function Bookmarks() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [user_id, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [verified, setVerified] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postUserDetails, setPostUserDetails] = useState([]);

  useEffect(() => {
    // const verifyUser = async () => {
    //   setIsLoading(true);
      
    //   const response = await getCurrentUser()

    //   if (response.$id) {
    //     setUserID(response.$id);
    //     setUsername(response.username);
    //     setName(response.name);
    //     setProfile(response.profile);
    //     setVerified(response.verified);
    //     setBookmarks(response.bookmarks || []);

    //     onMessage(messaging, (payload) => {
    //       toast({
    //         title: payload.notification.title,
    //         description: payload.notification.body,
    //         duration: 3000,
    //       });
    //     });
    //   } else {
    //     navigate('/explore');
    //   }

    //   setIsLoading(false);
    // };

    // verifyUser();
  }, []);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (bookmarks && bookmarks.length > 0) {
        setIsPostLoading(true);
        await fetchData();
        setIsPostLoading(false);
      }
    };

    loadBookmarks();

    const intervalId = setInterval(() => {
      if (bookmarks && bookmarks.length > 0) {
        fetchData();
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [bookmarks]);

  const fetchData = async() => {
    try {
      if (!bookmarks || bookmarks.length === 0) {
        setPosts([]);
        return;
      }

      const postResults = [];
      const userDetailsMap = [];

     
      setPosts(postResults);
      setPostUserDetails(userDetailsMap);
    } catch (error) {}
}

  if (isLoading) {
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
        <Header activeTab="#" username={username} name={name} profile={profile} verified={verified} />
        <div className="container mx-auto px-4 py-2 flex gap-8">
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <SideNav user_id={user_id} username={username} name={name} profile={profile} verified={verified}/>
          </aside>
          <main className="w-full lg:w-1/2 pb-16 lg:pb-0">
            <div className="flex justify-between items-center pb-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-foreground">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Bookmarks</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
                <Button size="icon" variant="outline" onClick={() => fetchData()}>
                  <RotateCw className="w-4 h-4" />
                </Button>
            </div>
            { isPostLoading ? (
                <div className="space-y-4 mb-4">
                    <div className="p-4 space-y-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <div className="flex space-x-4">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                    </div>
                </div>
            ) : posts.length === 0 ? (
                <div className='mt-12'>
                    <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                        <Bug className="w-24 h-24"/><br />
                        <h1 className='text-4xl font-bold leading-tight'>Nothing to see 👀</h1>
                        <p className='text-center text-muted-foreground mb-6'>
                            Bookmarks will appear here <br/> when you add a post to bookmarks.
                        </p>
                    </div>
                </div>
            ) : (
                posts.map((post, index) => (
                    <Post 
                    key={index} 
                    currentUserID={user_id}
                    currentUsername={username}
                    id={post.$id} 
                    user_id={post.user_id} 
                    name={postUserDetails[post.$id]?.name} 
                    username={postUserDetails[post.$id]?.username} 
                    profile={postUserDetails[post.$id]?.profile} 
                    isVerified={postUserDetails[post.$id]?.verified} 
                    timestamp={post.$createdAt} 
                    caption={post.caption} 
                    type={post.type} 
                    files={post.files} 
                    location={post.location} 
                    hashtags={post.hashtags} 
                    tagged_people={post.tagged_people} 
                    likes={post.likes} 
                    comments={post.comment} 
                    reposts={post.reposts} 
                    {...post} 
                    />
                ))
            )}
          </main>
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <div className="space-y-6">
              <Sidebar />
              <FollowSuggestions />
              <p className='pl-4 text-sm text-muted-foreground'>2025 DreamsDoc © TeamCdac <br/><a href="https://www.cdac.com" target='_blank'>www.cdac.com</a></p>
            </div>
          </aside>
        </div>
        <BottomNav user_id={user_id} username={username} name={name} profile={profile} verified={verified}/>
      </div>
    </RootLayout>
  );
}