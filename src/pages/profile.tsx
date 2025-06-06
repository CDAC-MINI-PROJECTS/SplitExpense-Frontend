import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "../components/header";
import BottomNav from "../components/bottom-nav";
import Post from "../components/post";
import FollowSuggestions from "../components/follow-suggestions";
import {
  Copy,
  Loader2,
  Share,
  BadgeCheck,
  UserPlus,
  Edit2,
  Eye,
  CalendarDays,
  MapPin,
  LinkIcon,
  Mail,
  Phone,
  Briefcase,
  Cake,
  LayoutGrid,
  Repeat2,
  Contact,
  Bug,
  RotateCw,
  UserCheck,
  Star,
  UserX,
} from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import RootLayout from "./layout";
import { FaGoogleDrive } from "react-icons/fa";
import NotFoundError from "./404";
import API from "@/lib/api";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useGoogleDriveAPI } from "@/hooks/useGoogleDriveAPI";
import FollowingDetailsDrawer from "@/components/ui/FollowingDetailsDrawer";
import { transformFollowerData } from "@/lib/utils";

interface UserDetails {
  userId: string;
  username: string;
  name: string;
  profile: string;
  verified: boolean;
  followers: string[];
  followings: string[];
  bio: string;
  location: string;
  website: string[];
  occupation: string[];
  birthday: string;
  joinDate: string;
  contactEmail: string;
  email: string;
  phone: string | null;
  cover: string;
  posts: any[];
  reposts: any[];
  taggedPosts: any[];
  favors: any[];
  profilePictureUrl: string;
  coverPictureUrl: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export default function AccountProfile({ user }) {
  const { toast } = useToast();
  const { id } = useParams();

  // State Variables
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(true);
  const [userExists, setUserExists] = useState(true);
  const [currentUserID, setCurrentUserID] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentProfile, setCurrentProfile] = useState("");
  const [currentVerified, setCurrentVerified] = useState(false);
  const [currentFollowings, setCurrentFollowings] = useState([]);
  const [currentFavorites, setCurrentFavorites] = useState([]);
  const [user_id, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [verified, setVerified] = useState(false);
  const [cover, setCover] = useState("");
  const [bio, setBio] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [favors, setFavors] = useState([]);
  const [location, setLocation] = useState("");
  const [website, setWebsite]: any[] = useState([]);
  const [contactEmail, setContactEmail] = useState("");
  const [occupation, setOccupation] = useState([]);
  const [birthday, setBirthday] = useState("");
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [tagged_posts, setTags] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [followed, setFollowed] = useState<boolean>(false);
  const [followerDetails, setFollowerDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpen2, setIsDrawerOpen2] = useState(false);
  const [repostUserDetails, setRepostUserDetails] = useState({});
  const [tagUserDetails, setTagUserDetails] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");

  const fetchData = async () => {
    try {
      const response = await API.get(`/users/${id}`);

      if (response?.data) {
        const {
          profile,
          cover,
          bio,
          firstName: name,
          username,
          email,
          phone,
          verified,
          location,
          website,
          occupation,
          dob: birthday,
          createdAt: joinDate,
          userId,
        } = response?.data;
        setProfile(profile);
        setCover(cover);
        setBio(bio || "");
        setName(name || "");
        setUsername(username || "");
        setEmail(email || "");
        setPhone(phone || null);
        setVerified(verified || false);
        setLocation(location || "");
        setWebsite(website || []);
        setOccupation(occupation || []);
        setUserID(userId);
        console.log(user.userId, "user.userId");
        getFollower(user.userId, userId);
      }
      setIsBtnLoading(false);
      setIsPostsLoading(false);
      setIsLoading(false);
    } catch (error) {}
  };

  const fetchPost = async (userId: number) => {
    try {
      const response = await API.get(`/dreams/user/${userId}`);
      if (response.data) {
        setPosts(response.data);
        setIsPostsLoading(false);
      } else {
        setPosts([]);
        setIsPostsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  const verifyUser = async () => {};

  const refreshPosts = () => {
    // fetchData();
    toast({
      title: "Posts refreshed",
      description: "Check for new posts.",
      duration: 3000,
    });
  };

  const {
    GoogleDriveAuth,
    searchFolder,
    createFolder,
    uploadFile,
    resetToken,
    accessToken,
  } = useGoogleDriveAPI();

  // Handlders
  const handleFileUpload = async (
    files: File[],
    type: string
  ): Promise<string[]> => {
    try {
      let folderId = await searchFolder("DreamsBlog");

      if (!folderId) {
        folderId = await createFolder("DreamsBlog");
      }

      const uploadPromises = files.map((file) =>
        uploadFile(file, folderId, type)
      );
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      resetToken();
      toast({
        title: "Failed to upload media",
        description: "Please sign into Google Drive again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEditProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsEditDialogOpen(false);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      let newProfileUrl = profile;
      let newCoverUrl = cover;

      // Handle file uploads first
      if (profileFile) {
        const [profileUrl] = await handleFileUpload([profileFile], "profile");
        newProfileUrl = profileUrl;
      }
      if (coverFile) {
        const [coverUrl] = await handleFileUpload([coverFile], "cover");
        newCoverUrl = coverUrl;
      }

      //Upate Profile
      const updatedProfile = {
        profile: newProfileUrl,
        cover: newCoverUrl,
        bio: bio,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        phone: phone,
        country: country,
        state: state,
        city: city,
        zip: zip,
        address: address,
        website: website,
      };

      console.log("Updated Profile:", updatedProfile);

      await API.put(`/users/${currentUsername}`, updatedProfile);
      await fetchData();
      toast({ title: "Profile updated successfully" });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const follow = async () => {
    await API.post("/follows", {
      followedId: user_id,
      followerId: user.userId,
    });
    getFollower(user.userId, user_id);
    setFollowed(true);
  };

  const getFollower = async (followerId, followingId) => {
    console.log("isFollwer");

    const follower = await API.get(`/follows/followers/${followingId}`);
    let tranformData = transformFollowerData(follower.data, 'follower');
    setFollowerDetails(tranformData.connections);
    setFollowers(follower.data);
    const following = await API.get(`/follows/following/${followingId}`);
    let tranformData1 = transformFollowerData(following.data, 'following');
    setFollowingDetails(tranformData1.connections);
    setFollowings(following.data);

    console.log("following", following);
    console.log("follower", follower);

    const isFollower = await API.get(
      `/follows/isFollowing/${followerId}/${followingId}`
    );
    setFollowed(isFollower.data);
    //  return response.data;
  };

  const favorite = async () => {};

  const unfollow = async () => {
    setFollowed(false);
  };

  const handleUserClick = () => {
    setIsDrawerOpen(false);
  };

  const handleUserClick2 = () => {
    setIsDrawerOpen2(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  // Side Effects
  useEffect(() => {
    setCurrentUsername(user?.username);
  }, [user]);

  useEffect(() => {
    if (followers.length && currentUserID) {
      setFollowed(followers.includes(currentUserID));
    }
  }, [followers, currentUserID]);

  useEffect(() => {
    setFollowed(followed);
  }, [followed]);

  useEffect(() => {
    if (user?.userId) {
      fetchPost(user?.userId);
    }
  }, [user?.userId]);

  // Render Logic
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center">
        <Loader2 className="animate-spin" />
        Loading...
      </div>
    );
  }

  if (!userExists) {
    return <NotFoundError />;
  }

  return (
    <RootLayout>
      <div className="min-h-screen bg-background">
        <Header
          activeTab="#"
          username={currentUsername}
          name={currentName}
          profile={currentProfile}
          verified={currentVerified}
        />
        <main className="container mx-auto px-4 py-2">
          {/* Breadcrumb and Refreshed Posts */}
          <div className="flex justify-between items-center pb-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-foreground">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>@{id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Button
              size="icon"
              variant="outline"
              onClick={() => refreshPosts()}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative mb-12">
            <PhotoProvider>
              <PhotoView
                src={
                  cover ||
                  `https://placehold.co/3840x2160/020617/FFFFFF?text=${user?.firstName}`
                }
              >
                <img
                  src={
                    cover ||
                    `https://placehold.co/3840x2160/020617/FFFFFF?text=${user?.firstName}`
                  }
                  className="w-full h-48 object-cover lg:h-96 rounded-lg"
                  alt="Cover Image"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/3840x2160/020617/FFFFFF?text=${user?.firstName}`;
                  }}
                />
              </PhotoView>
            </PhotoProvider>
            {profile && (
              <PhotoProvider>
                <PhotoView
                  src={
                    profile ||
                    `https://placehold.co/3840x2160/020617/FFFFFF?text=${user?.firstName}`
                  }
                >
                  <Avatar className="absolute bottom-0 left-4 transform translate-y-1/2 w-40 h-40 lg:w-30 lg:h-30 border-4 border-background">
                    <AvatarImage
                      src={
                        profile ||
                        `https://placehold.co/3840x2160/020617/FFFFFF?text=${user?.firstName}`
                      }
                      alt={name}
                      className="object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/3840x2160/020617/FFFFFF?text=${user?.firstName}`;
                      }}
                    />
                    <AvatarFallback>MM</AvatarFallback>
                  </Avatar>
                </PhotoView>
              </PhotoProvider>
            )}
          </div>
          <div className="flex justify-between items-start mb-4 mt-20">
            <div className="ml-2">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">{name}</h1>
                {verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>Verified</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-muted-foreground">@{username}</p>
            </div>

            <div className="hidden lg:flex items-end gap-2">
              {username != undefined ? (
                isBtnLoading ? (
                  <Button className="gap-2" disabled>
                    <Loader2 className="animate-spin" />
                    Loading
                  </Button>
                ) : currentUsername === id ? (
                  <Button onClick={() => setIsEditDialogOpen(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : followed != undefined ? (
                  followed === true ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="gap-2">
                          <UserCheck className="w-4 h-4" />
                          Following
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 text-center">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => favorite()}
                          >
                            <Star className="h-4 w-4" />
                            Favorites
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-600 gap-2"
                            onClick={() => unfollow()}
                          >
                            <UserX className="h-4 w-4" />
                            Unfollow
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button className="gap-2" onClick={() => follow()}>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </Button>
                  )
                ) : (
                  <Button className="gap-2" disabled>
                    <Loader2 className="animate-spin" />
                    Loading
                  </Button>
                )
              ) : (
                <Link to="/sign-in">
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                </Link>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Share className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="lg:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Profile</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Input id="link" defaultValue={""} readOnly />
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(``);
                        toast({ title: "Copied to clipboard." });
                      }}
                    >
                      <span className="sr-only">Copy</span>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <p className="ml-2 mb-2">{bio}</p>

          <div className="md:w-1/3 flex items-start mb-2">
            <div className="flex gap-4">
              <FollowingDetailsDrawer
                open={isDrawerOpen}
                setOpen={setIsDrawerOpen}
                title="Followers"
                description={`People who follow @${username}`}
                triggerCount={followers.length}
                triggerLabel="Followers"
                users={followerDetails}
                onUserClick={handleUserClick}
              />
              <FollowingDetailsDrawer
                open={isDrawerOpen2}
                setOpen={setIsDrawerOpen2}
                title="Followings"
                description={`People that @${username} follows`}
                triggerCount={followings.length}
                triggerLabel="Followings"
                users={followingDetails}
                onUserClick={handleUserClick2}
              />
            </div>
          </div>

          <div className="mt-4 flex lg:hidden gap-2">
            {username == undefined ? (
              <Link to="/sign-in" className="w-full">
                <Button className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>
              </Link>
            ) : isBtnLoading ? (
              <Button className="w-full gap-2" disabled>
                <Loader2 className="animate-spin" />
                Loading
              </Button>
            ) : currentUsername === id ? (
              <Button
                className="w-full gap-2"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : followed != undefined ? (
              followed === true ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full gap-2">
                      <UserCheck className="w-4 h-4" />
                      Following
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 text-center">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => favorite()}
                      >
                        <Star className="h-4 w-4" />
                        Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-600 gap-2"
                        onClick={() => unfollow()}
                      >
                        <UserX className="h-4 w-4" />
                        Unfollow
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button className="w-full gap-2" onClick={() => follow()}>
                  <UserPlus className="w-4 h-4" />
                  Follow
                </Button>
              )
            ) : (
              <Button className="w-full gap-2" disabled>
                <Loader2 className="animate-spin" />
                Loading
              </Button>
            )}

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="w-[100rem] lg:max-w-[60rem] ">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditProfile} className="h-full">
                  <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto ">
                    <div className="grid gap-2 p-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        className="text-md"
                        defaultValue={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2 lg:grid-cols-2 p-2 mr-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">First Name</Label>
                        <Input
                          id="name"
                          name="name"
                          className="text-md"
                          defaultValue={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Last Name</Label>
                        <Input
                          id="name"
                          name="name"
                          className="text-md"
                          defaultValue={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2 lg:grid-cols-2 p-2 mr-4">
                      <div className="grid gap-2">
                        <Label htmlFor="emial">Email</Label>
                        <Input
                          id="emial"
                          name="email"
                          className="text-md"
                          defaultValue={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          className="text-md"
                          defaultValue={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 p-2 mr-4">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        name="bio"
                        className="text-md"
                        defaultValue={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2 lg:grid-cols-4 p-2 p-2 mr-4">
                      <div className="grid gap-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          className="text-md"
                          defaultValue={country}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          className="text-md"
                          defaultValue={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          className="text-md"
                          defaultValue={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="zip">Zipcode</Label>
                        <Input
                          id="zip"
                          name="zip"
                          className="text-md"
                          defaultValue={zip}
                          onChange={(e) => setZip(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2 p-2 mr-4">
                      <Label htmlFor="adrress">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        className="text-md"
                        defaultValue={address}
                        onChange={(e) => setAddress(e.target.value.trim())}
                      />
                    </div>
                    <div className="grid gap-2 p-2 mr-4">
                      <Label htmlFor="website">
                        Websites (comma-separated)
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        className="text-md"
                        defaultValue={website.join(",")}
                        onChange={(e) =>
                          setWebsite(
                            e.target.value.split(",").map((w) => w.trim())
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-12 lg:grid-cols-2 p-2 mr-4">
                      <div className="grid gap-2">
                        <Label>Profile Picture</Label>
                        {accessToken == undefined ? (
                          <Button
                            variant="outline"
                            onClick={() => GoogleDriveAuth()}
                            className="w-full"
                          >
                            <FaGoogleDrive className="h-4 w-4 mr-2" />
                            <span>Sign in with Google Drive</span>
                          </Button>
                        ) : (
                          <Input
                            type="file"
                            name="profile_picture"
                            accept="image/*"
                            onChange={(e) => setProfileFile(e.target.files[0])}
                          />
                        )}
                      </div>
                      <div className="grid gap-2">
                        <Label>Cover Photo</Label>
                        {accessToken == undefined ? (
                          <Button
                            variant="outline"
                            onClick={() => GoogleDriveAuth()}
                            className="w-full"
                          >
                            <FaGoogleDrive className="h-4 w-4 mr-2" />
                            <span>Sign in with Google Drive</span>
                          </Button>
                        ) : (
                          <Input
                            type="file"
                            name="cover_photo"
                            accept="image/*"
                            onChange={(e) => setCoverFile(e.target.files[0])}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex justify-between mt-4">
                    <Button type="submit">Save Changes</Button>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Details</DialogTitle>
                </DialogHeader>
                <ul className="space-y-2">
                  {((country && state) || city) && (
                    <li className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="w-4 h-4 mr-2" />
                      </div>
                      <span className="break-all flex-1">{`${country},${state},${city}`}</span>
                    </li>
                  )}
                  {website &&
                    website.map((url, index) => (
                      <li key={index} className="flex items-center">
                        <div className="flex-shrink-0">
                          <LinkIcon className="w-4 h-4 mr-2" />
                        </div>
                        <a
                          href={url.startsWith("http") ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all flex-1"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  {email && (
                    <li className="flex items-center">
                      <div className="flex-shrink-0">
                        <Mail className="w-4 h-4 mr-2" />
                      </div>
                      <span className="break-all flex-1">{email}</span>
                    </li>
                  )}
                  {phone && (
                    <li className="flex items-center">
                      <div className="flex-shrink-0">
                        <Phone className="w-4 h-4 mr-2" />
                      </div>
                      <span className="break-all flex-1">{phone}</span>
                    </li>
                  )}
                  {occupation.map((job, index) => (
                    <li key={index} className="flex items-center">
                      <div className="flex-shrink-0">
                        <Briefcase className="w-4 h-4 mr-2" />
                      </div>
                      <span className="break-all flex-1">{job}</span>
                    </li>
                  ))}
                  {birthday && (
                    <li className="flex items-center">
                      <Cake className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(birthday)
                          .toLocaleDateString("en-US")
                          .replace(/\//g, "-")}
                      </span>
                    </li>
                  )}
                  {joinDate && (
                    <li className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span>
                        Joined{" "}
                        {new Date(joinDate)
                          .toLocaleDateString("en-US")
                          .replace(/\//g, "-")}
                      </span>
                    </li>
                  )}
                </ul>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="w-1/4 min-w-9" variant="outline">
                  <Share className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="lg:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Profile</DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to view this.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input id="link" defaultValue={``} readOnly />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(``);
                      toast({ title: "Copied to clipboard." });
                    }}
                  >
                    <span className="sr-only">Copy</span>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>

        <div className="container mx-auto px-4 flex gap-8">
          <aside className="hidden lg:block w-1/4 sticky top-20 mb-4 self-start">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {((country && state) || city) && (
                    <li className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="w-4 h-4 mr-2" />
                      </div>
                      <span className="break-all flex-1">{`${country},${state},${city}`}</span>
                    </li>
                  )}
                  {website &&
                    website.map((url, index) => (
                      <li key={index} className="flex items-center">
                        <div className="flex-shrink-0">
                          <LinkIcon className="w-4 h-4 mr-2" />
                        </div>
                        <a
                          href={url.startsWith("http") ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all flex-1"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  {email && (
                    <li className="flex items-center">
                      <div className="flex-shrink-0">
                        <Mail className="w-4 h-4 mr-2" />
                      </div>
                      <span className="break-all flex-1">{email}</span>
                    </li>
                  )}
                  {phone && (
                    <li className="flex items-center">
                      <div className="flex-shrink-0">
                        <Phone className="w-4 h-4 mr-2" />
                      </div>
                      <span className="break-all flex-1">{phone}</span>
                    </li>
                  )}
                  {occupation.map((job, index) => (
                    <li key={index} className="flex items-center">
                      <div className="flex-shrink-0">
                        <Briefcase className="w-4 h-4 mr-2" />
                      </div>
                      <span className="break-all flex-1">{job}</span>
                    </li>
                  ))}
                  {birthday && (
                    <li className="flex items-center">
                      <Cake className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(birthday)
                          .toLocaleDateString("en-US")
                          .replace(/\//g, "-")}
                      </span>
                    </li>
                  )}
                  {joinDate && (
                    <li className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span>
                        Joined{" "}
                        {new Date(joinDate)
                          .toLocaleDateString("en-US")
                          .replace(/\//g, "-")}
                      </span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </aside>
          <main className="w-full lg:w-1/2 pb-16 lg:pb-0">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts" className="gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden md:block">Posts</span>
                </TabsTrigger>
                <TabsTrigger value="reposts" className="gap-2">
                  <Repeat2 className="w-4 h-4" />
                  <span className="hidden md:block">Reposts</span>
                </TabsTrigger>
                <TabsTrigger value="tags" className="gap-2">
                  <Contact className="w-4 h-4" />
                  <span className="hidden md:block">Tags</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                {isPostsLoading ? (
                  <div className="space-y-4 mt-4 mb-4">
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
                  <div className="mt-12">
                    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
                      <Bug className="w-24 h-24" />
                      <br />
                      <h1 className="text-4xl font-bold leading-tight">
                        Nothing to see 👀
                      </h1>
                      <p className="text-center text-muted-foreground mb-6">
                        Posts will appear here <br /> when @{username} creates a
                        post.
                      </p>
                    </div>
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <Post
                      key={index}
                      currentUserID={currentUserID}
                      currentUsername={currentUsername}
                      id={post.$id}
                      user_id={post.user.user_id}
                      name={post.user.firstName}
                      username={post.user.username}
                      profile={post.user.profile}
                      isVerified={verified}
                      timestamp={post.createdAt}
                      caption={post.content}
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
              </TabsContent>
              <TabsContent value="reposts">
                {isPostsLoading ? (
                  <div className="space-y-4 mt-4 mb-4">
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
                ) : reposts.length === 0 ? (
                  <div className="mt-12">
                    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
                      <Bug className="w-24 h-24" />
                      <br />
                      <h1 className="text-4xl font-bold leading-tight">
                        Nothing to see 👀
                      </h1>
                      <p className="text-center text-muted-foreground mb-6">
                        Reposts will appear here <br /> when @{username}{" "}
                        reposts.
                      </p>
                    </div>
                  </div>
                ) : (
                  reposts.map((repost, index) => (
                    <Post
                      key={index}
                      currentUserID={currentUserID}
                      currentUsername={currentUsername}
                      id={repost.$id}
                      user_id={repost.user_id}
                      name={repostUserDetails[repost.$id]?.name}
                      username={repostUserDetails[repost.$id]?.username}
                      profile={repostUserDetails[repost.$id]?.profile}
                      isVerified={repostUserDetails[repost.$id]?.verified}
                      timestamp={repost.$createdAt}
                      caption={repost.caption}
                      type={repost.type}
                      files={repost.files}
                      location={repost.location}
                      hashtags={repost.hashtags}
                      tagged_people={repost.tagged_people}
                      likes={repost.likes}
                      comments={repost.comment}
                      reposts={repost.reposts}
                      {...repost}
                    />
                  ))
                )}
              </TabsContent>
              <TabsContent value="tags">
                {isPostsLoading ? (
                  <div className="space-y-4 mt-4 mb-4">
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
                ) : tagged_posts.length === 0 ? (
                  <div className="mt-12">
                    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
                      <Bug className="w-24 h-24" />
                      <br />
                      <h1 className="text-4xl font-bold leading-tight">
                        Nothing to see 👀
                      </h1>
                      <p className="text-center text-muted-foreground mb-6">
                        Tags will appear here <br /> when @{username} is tagged
                        in a post.
                      </p>
                    </div>
                  </div>
                ) : (
                  tagged_posts.map((tag, index) => (
                    <Post
                      key={index}
                      currentUserID={currentUserID}
                      currentUsername={currentUsername}
                      id={tag.$id}
                      user_id={tag.user_id}
                      name={tagUserDetails[tag.$id]?.name}
                      username={tagUserDetails[tag.$id]?.username}
                      profile={tagUserDetails[tag.$id]?.profile}
                      isVerified={tagUserDetails[tag.$id]?.verified}
                      timestamp={tag.$createdAt}
                      caption={tag.caption}
                      type={tag.type}
                      files={tag.files}
                      location={tag.location}
                      hashtags={tag.hashtags}
                      tagged_people={tag.tagged_people}
                      likes={tag.likes}
                      comments={tag.comment}
                      reposts={tag.reposts}
                      {...tag}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </main>
          <aside className="hidden lg:block w-1/4 sticky top-20 self-start">
            <div className="space-y-6">
              <FollowSuggestions />
              <p className="pl-4 text-sm text-muted-foreground">
                2025 DreamsDoc © TeamCdac <br />
                <a href="https://www.cdac.com" target="_blank">
                  www.cdac.com
                </a>
              </p>
            </div>
          </aside>
        </div>
        <BottomNav
          user_id={user_id}
          username={currentUsername}
          name={currentName}
          profile={currentProfile}
          verified={currentVerified}
        />
      </div>
    </RootLayout>
  );
}
