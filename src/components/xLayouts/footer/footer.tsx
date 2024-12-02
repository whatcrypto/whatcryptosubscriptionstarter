"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// importing ui library
import { Separator } from "@/components/ui/separator";

// importing for translation
import { useTranslation } from "@/components/translation/TranslationsProvider";

// importing images
import TMLogoLight from "@/public/images/navbar/TM Logo Light.svg";
import TMLogoDark from "@/public/images/navbar/TM Logo Dark.svg";

// importing icons
import { BsYoutube, BsDiscord, BsInstagram } from "react-icons/bs";
import { FaRss, FaFacebookF, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface FooterProps {
    fullWidth?: boolean; // Optional boolean prop
}

// sub components
const RenderIcon = ({ array }: any) => {
    return (
        <>
            {
                array?.map((item: any, index: number) => {
                    return (
                        <Link
                            href={item?.link}
                            key={item?.link}
                            target="_blank"
                            className={`
                                h-[30px] w-[30px] rounded-full flex justify-center items-center bg-[#FFFFFF] dark:bg-[#1A1A20] border border-[#E6E9EF] dark:border-[#414249]
                                ${index === 0 ? "mr-2" : "mx-2"}
                            `}
                        >
                            <item.icon className="text-[14px] text-[#71717A] dark:text-[#A1A1AA]" data-testid={item?.testID} />
                        </Link>
                    );
                })
            }
        </>
    );
};

// sub components
const FooterLinkComponent = ({ title, array, pricingSection = false }: any) => {
    return (
        <div>
            <div className="flex items-center mb-2">
                <Separator orientation="vertical" className="w-[2px] h-[20px] bg-[#FFCF30] dark:bg-[#FFCF30]" />
                <span className="text-[16px] font-medium mx-2">{title}</span>
            </div>
            <div className="text-[#71717A] dark:text-[#A1A1AA] flex flex-col text-[14px] font-[400]">
                {
                    array?.map((item: any) => {
                        return (
                            <Link 
                                href={pricingSection ? '/settings' : item?.link} target="_blank" 
                                rel={!pricingSection ? "noopener noreferrer" : undefined} 
                                className="my-1 mr-5" 
                                key={item?.text}
                            >
                                {item?.text}
                            </Link>
                        );
                    })
                }
            </div>
        </div>
    );
};

// main component
const Footer: React.FC<FooterProps> = ({ fullWidth = false }) => {
    const { t } = useTranslation();
    const footerContent = {
        footerIconsFirstPart: [
            {
                link: 'https://twitter.com/tokenmetricsinc',
                icon: FaXTwitter,
                testID: 'twitterIcon'
            },
            {
                link: 'https://www.youtube.com/tokenmetrics/',
                icon: BsYoutube,
                testID: 'youtubeIcon'
            },
            {
                link: 'https://t.me/tokenmetrics',
                icon: FaTelegramPlane,
                testID: 'telegramIconOne'
            },
            {
                link: 'https://discord.com/invite/tokenmetricsofficial',
                icon: BsDiscord,
                testID: 'discordIcon'
            },
        ],
        footerIconsSecondPart: [
            {
                link: 'https://t.me/TokenMetricsDiscussion',
                icon: FaTelegramPlane,
                testID: 'telegramIconTwo'
            },
            {
                link: 'https://www.facebook.com/tokenmetrics',
                icon: FaFacebookF,
                testID: 'facebookIcon'
            },
            {
                link: 'https://www.tokenmetrics.com/blog',
                icon: FaRss,
                testID: 'rssIcon'
            },
            {
                link: 'https://www.instagram.com/tokenmetrics/',
                icon: BsInstagram,
                testID: 'instagramIcon'
            },
        ],
        companySection: {
            title: t("footer:footerCompany"),
            array: [
                {
                    link: 'https://www.tokenmetrics.com/about',
                    text: t("footer:footerAbout")
                },
                {
                    link: 'https://jobs.lever.co/tokenmetrics',
                    text: t("footer:footerCareers")
                },
                {
                    link: 'https://www.tokenmetrics.com/contact-us',
                    text: t("footer:footerContactUs")
                },
                {
                    link: 'https://www.tokenmetrics.com/terms-and-conditions',
                    text: t("footer:footerTerms")
                },
                {
                    link: 'https://www.tokenmetrics.com/privacy-policy',
                    text: t("footer:footerPrivacy")
                },
                {
                    link: 'https://www.tokenmetrics.com/disclosures',
                    text: t("footer:footerDisclosures")
                }
            ],
        },
        resourceSection: {
            title: t("footer:footerResources"),
            array: [
                {
                    link: 'https://help.tokenmetrics.com/',
                    text: t("footer:footerHelpAndSupport")
                },
                {
                    link: 'https://feedback.tokenmetrics.com/',
                    text: t("footer:footerFeedback")
                },
                {
                    link: 'https://research.tokenmetrics.com/',
                    text: t("footer:footerResources")
                }
            ]
        },
        productSection:{
            title: t("footer:footerProducts"),
            array: [
                {
                    link: 'https://app.tokenmetrics.com/market',
                    text: t("footer:footerAnalyticsPlatform")
                },
                {
                    link: 'https://www.tokenmetrics.com/trading-view-indicator',
                    text: t("footer:footerTradingViewIndicator")
                },
                {
                    link: 'https://www.tokenmetrics.com/crypto-investing-guide',
                    text: t("footer:footerCryptoInvesting")
                },
                {
                    link: 'https://www.tokenmetrics.com/crypto-data-api',
                    text: t("footer:footerDataAPI")
                },
                {
                    link: 'https://astrobot.tokenmetrics.com',
                    text: t("footer:footerAstrobotSociety")
                }
            ]
        },
        planSection: {
            title: t("footer:footerPricing"),
            array: [
                {
                    text: t("footer:footerBASICPlan")
                },
                {
                    text: t("footer:footerADVANCEDPlan")
                },
                {
                    text: t("footer:footerPREMIUMPlan")
                },
                {
                    text: t("footer:footerVIPPlan")
                },
            ]
        },
        footerDisclaimerParas: [
            t("footer:footerParaOne"),
            t("footer:footerParaTwo"),
            t("footer:footerParaThree"),
            t("footer:footerParaFour"),
            t("footer:footerParaFifth")
        ]
    };
    return (
        <div className="dark:bg-[#111116] bg-[#F2F4FA] pt-8 w-full">
            <div className={`flex justify-between flex-col xsl:flex-row px-4 ${fullWidth ? "max-w-[1614px] mx-auto" : "w-full 2xl:px-[5%]"}`}>
                <div className="flex justify-center xsl:justify-normal flex-col items-center mb-2 xsl:mb-0">
                    <div className="flex justify-center xsl:justify-start w-full">
                        <Image src={TMLogoLight} alt="TM Logo" className="dark:hidden" height={42} width={120} data-testid="tm-light-logo" />
                        <Image src={TMLogoDark} alt="TM Logo" className="hidden dark:block " height={42} width={120} data-testid="tm-dark-logo" />
                    </div>
                    <div className="flex flex-col sm:flex-row xsl:flex-col mt-2 sm:mt-0 xsl:mt-2">
                        <div className="flex my-2 sm:my-4 xsl:my-2 mr-1 xsl:mx-0">
                            <RenderIcon array={footerContent.footerIconsFirstPart} />
                        </div>
                        <div className="flex my-2 sm:my-4 xsl:my-2 sm:ml-1 xsl:mx-0">
                            <RenderIcon array={footerContent?.footerIconsSecondPart} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between w-full flex-wrap md:flex-nowrap xsl:ml-[50px] 2xl:ml-[7%]">
                    <div className="mx-0 pr-5 md:pr-0 md:mx-1 order-4 md:order-1 w-1/2 md:w-[180px] flex flex-col xsl:items-end  mt-5 sm:mt-2 md:mt-0">
                        <FooterLinkComponent title={footerContent?.companySection?.title} array={footerContent?.companySection?.array} />
                    </div>
                    <div className="mx-0 pr-5 md:pr-0 md:mx-1 order-2 md:order-3 w-1/2 md:w-[180px] flex flex-col xsl:items-end">
                        <FooterLinkComponent title={footerContent?.resourceSection?.title} array={footerContent?.resourceSection?.array} />
                    </div>
                    <div className="mx-0 pr-5 md:pr-0 md:mx-1 order-3 md:order-2 w-1/2 md:w-[180px] flex flex-col xsl:items-end  mt-5 sm:mt-2 md:mt-0">
                        <FooterLinkComponent title={footerContent?.productSection?.title} array={footerContent?.productSection?.array} />
                    </div>
                    <div className="mx-0 pr-5 md:pr-0 md:mx-1 order-1 md:order-4 w-1/2 md:w-[180px] flex flex-col xsl:items-end">
                        <FooterLinkComponent title={footerContent.planSection?.title} array={footerContent.planSection.array} pricingSection={true} />
                    </div>
                </div>
            </div>
            <Separator className={`my-5 bg-[#E7E9EC] dark:bg-[#2F3037] ${fullWidth ? "max-w-[1588px] mx-auto" : "w-full"}`} />
            <div className={`pb-2 text-[#71717A] dark:text-[#A1A1AA] text-[14px] font-[400] px-4 ${fullWidth ? "max-w-[1614px] mx-auto" : "w-full 2xl:px-[5%]"}`}>
                {
                    footerContent?.footerDisclaimerParas?.map((item: string) => {
                        return (
                            <p key={item} className="my-4">{item}</p>
                        );
                    })
                }
            </div>
            <div className="bg-[#FFCF30] h-[40px] flex items-center justify-center">
                <span className="text-[#09090B] text-[14px] font-[400] text-center">{t("footer:tokenMetricsRightReserved")}</span>
            </div>
        </div>
    );
};

export default Footer;