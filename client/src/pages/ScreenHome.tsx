import {
  BellIcon,
  BookmarkIcon,
  ChevronRightIcon,
  DollarSignIcon,
  HeartIcon,
  HomeIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import React from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const ScreenHome = (): JSX.Element => {
  // Data for the creator profiles in the horizontal scroll
  const creatorProfiles = [
    { id: 1, src: "/figmaAssets/ellipse-4.png", alt: "Creator profile" },
    { id: 2, src: "/figmaAssets/frame-14.png", alt: "Creator profile" },
    { id: 3, src: "/figmaAssets/ellipse-5.png", alt: "Creator profile" },
    { id: 4, src: "/figmaAssets/ellipse-7.png", alt: "Creator profile" },
    { id: 5, src: "/figmaAssets/ellipse-8.png", alt: "Creator profile" },
  ];

  // Data for suggested creators
  const suggestedCreators = [
    {
      id: 1,
      name: "Lorena ruiva",
      username: "@ruivinhaa",
      verified: true,
      bio: "Vem me seguir meu amor você não perde por esperar...",
      image: "/figmaAssets/frame-14.png",
      profilePic: "/figmaAssets/ellipse-13.png",
    },
    {
      id: 2,
      name: "Marina Macedo",
      username: "@marihot_",
      verified: true,
      bio: "22y\numa garota meiga e louca pra sentar 😏",
      image: "/figmaAssets/frame-15.png",
      profilePic: "/figmaAssets/ellipse-14.png",
    },
  ];

  // Pagination indicators
  const paginationDots = [
    { id: 1, active: true, width: "w-[30px]", height: "h-5" },
    { id: 2, active: false, width: "w-[18px]", height: "h-[18px]" },
    { id: 3, active: false, width: "w-[18px]", height: "h-[18px]" },
  ];

  return (
    <div className="flex flex-col h-[1728px] items-center gap-[35px] relative bg-[#fdfdfa]">
      {/* Header */}
      <img
        className="relative self-stretch w-full h-[129px]"
        alt="Head"
        src="/figmaAssets/head.svg"
      />

      {/* Creator profiles horizontal scroll */}
      <ScrollArea className="relative w-[411px] h-[95px]">
        <div className="flex space-x-[25px]">
          {creatorProfiles.map((profile) => (
            <Avatar key={profile.id} className="w-20 h-20">
              <AvatarImage
                src={profile.src}
                alt={profile.alt}
                className="object-cover"
              />
              <AvatarFallback>CP</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Suggested creators section */}
      <div className="relative w-[423px] h-[713px]">
        {/* Section header */}
        <div className="absolute w-[400px] h-[60px] top-0 left-0 flex items-center justify-center">
          <h2 className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#8b8585] text-2xl text-center">
            Criadores sugeridos
          </h2>
          <Button variant="ghost" className="absolute right-0" size="icon" data-testid="button-view-more-creators">
            <ChevronRightIcon className="w-10 h-10" />
          </Button>
        </div>

        {/* Creator cards */}
        <div className="absolute w-[418px] h-[542px] top-[83px] left-[5px]">
          {suggestedCreators.map((creator, index) => (
            <Card
              key={creator.id}
              className="absolute w-[380px] h-64 rounded-[30px] overflow-hidden"
              style={{
                top: index === 0 ? "0" : "286px",
                left: "0",
                backgroundImage: `url(${creator.image})`,
                backgroundSize: "cover",
                backgroundPosition: "50% 50%",
              }}
            >
              <CardContent className="p-0">
                <div className="relative h-[138px] top-[118px]">
                  <div className="absolute w-full h-[114px] bg-[#191818cc] backdrop-blur-[3px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(3px)_brightness(100%)]" />

                  <Avatar className="absolute w-[70px] h-[70px] top-0 left-[21px]">
                    <AvatarImage
                      src={creator.profilePic}
                      alt={creator.name}
                      className="object-cover"
                    />
                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col absolute top-[34px] left-[107px]">
                    <div className="flex items-center gap-2">
                      <span className="[font-family:'Inria_Sans',Helvetica] font-bold text-white text-base">
                        {creator.name}
                      </span>
                      {creator.verified && (
                        <img
                          className="w-5 h-5"
                          alt="Verified"
                          src="/figmaAssets/verified.png"
                        />
                      )}
                    </div>
                    <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#e71d36] text-sm">
                      {creator.username}
                    </span>
                    <p className="[font-family:'Inria_Sans',Helvetica] font-light text-white text-[13px] w-[142px] mt-1">
                      {creator.bio}
                    </p>
                  </div>

                  <Button 
                    className="absolute w-20 h-[30px] top-[30px] right-[21px] bg-[#e71d36] rounded-[40px] hover:bg-[#c41a2f]"
                    data-testid={`button-follow-${creator.id}`}
                  >
                    <span className="[font-family:'Inria_Sans',Helvetica] font-bold text-white text-[13px]">
                      Seguir
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="absolute w-[162px] h-8 top-[629px] left-[72px] flex items-center justify-center gap-2">
          {paginationDots.map((dot) => (
            <div
              key={dot.id}
              className={`${dot.width} ${dot.height} bg-[#d9d9d9] rounded-[20px]`}
            />
          ))}
        </div>
      </div>

      {/* Post section */}
      <div className="relative self-stretch w-full h-[578px]">
        <Card className="relative w-[410px] h-[524px] top-[26px] left-[15px] rounded-[10px] overflow-hidden border border-solid border-[#cccccc]">
          <CardHeader className="p-0">
            <div className="w-full h-[83px] bg-white rounded-[10px_10px_0px_0px] overflow-hidden flex items-center px-4">
              <Avatar className="w-[54px] h-[54px]">
                <AvatarImage
                  src="/figmaAssets/ellipse-19.png"
                  alt="Mariana Cardoso"
                  className="object-cover"
                />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>

              <div className="ml-3 flex flex-col">
                <span className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-base">
                  Mariana Cardoso
                </span>
                <span className="[font-family:'Inria_Sans',Helvetica] font-normal text-[#e71d33] text-sm">
                  @marimaricar_
                </span>
              </div>

              <span className="ml-auto mr-4 [font-family:'Inria_Sans',Helvetica] font-normal text-[#5d5b5b] text-xs">
                há 2 dias
              </span>

              <Button variant="ghost" size="icon" className="p-0" data-testid="button-post-options">
                <MoreVerticalIcon className="w-6 h-6 text-[#5d5b5b]" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div
              className="w-[410px] h-[363px]"
              style={{
                background: "url(/figmaAssets/fttpost2.png) 50% 50% / cover",
              }}
            />
          </CardContent>

          <CardFooter className="p-0">
            <div className="w-full h-[78px] bg-white rounded-[0px_0px_10px_10px] overflow-hidden">
              <div className="flex justify-between items-center px-8 pt-3.5">
                <Button variant="ghost" size="icon" className="p-0" data-testid="button-like-post">
                  <HeartIcon className="w-[35px] h-[35px] text-[#5d5b5b]" />
                </Button>

                <Button variant="ghost" size="icon" className="p-0" data-testid="button-comment-post">
                  <MessageSquareIcon className="w-[35px] h-[35px] text-[#5d5b5b]" />
                </Button>

                <Button variant="ghost" size="icon" className="p-0" data-testid="button-tip-post">
                  <DollarSignIcon className="w-[35px] h-[35px] text-[#5d5b5b]" />
                </Button>

                <Button variant="ghost" size="icon" className="p-0" data-testid="button-bookmark-post">
                  <BookmarkIcon className="w-[35px] h-[35px] text-[#5d5b5b]" />
                </Button>
              </div>

              <div className="flex gap-4 px-8 mt-2">
                <span className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-[11px]">
                  65 curtidas
                </span>
                <span className="[font-family:'Inria_Sans',Helvetica] font-bold text-[#5d5b5b] text-[11px]">
                  17 comentários
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Bottom navigation */}
      <div className="flex w-[440px] items-center justify-center gap-[30px] px-[5px] py-2.5 fixed bottom-0 left-0 bg-white rounded-[30px_30px_0px_0px] overflow-hidden shadow-[3px_4px_4px_#00000040]">
        <Button variant="ghost" size="icon" className="p-0" data-testid="nav-home">
          <HomeIcon className="w-[43px] h-9 text-[#e71d36]" />
        </Button>

        <Link href="/messages">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-messages">
            <MessageCircleIcon className="w-[38px] h-[38px] text-[#5d5b5b]" />
          </Button>
        </Link>

        <Link href="/search">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-search">
            <SearchIcon className="w-[38px] h-[38px] text-[#5d5b5b]" />
          </Button>
        </Link>

        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-notifications">
            <BellIcon className="w-[43px] h-[43px] text-[#5d5b5b]" />
          </Button>
        </Link>

        <Link href="/profile">
          <Button variant="ghost" size="icon" className="p-0" data-testid="nav-profile">
            <UserIcon className="w-[50px] h-[49px] text-[#5d5b5b]" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
