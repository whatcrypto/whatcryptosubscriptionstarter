import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// importing ui components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// importing custom functionality
import { formatNumber } from "@/utils/formatNumber";

// importing multi-language
import { useTranslation } from "@/components/translation/TranslationsProvider";

// images import
import RocketImg from "@/public/images/filtersicon/speed.svg";
import Tick from "@/public/images/sign up and sign in/Tick.svg";

// importing icons
import { postHogEvents } from "@/components/PostHog/postHogEvents";
import Button2 from "@/components/ui/button2";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import useUser from "@/components/useUser";
import componentIDs from "@/constants/componentIDs";
import { CircleOff } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { AiOutlineClose } from "react-icons/ai";

interface UpgradeHeaderProps {
  upgradePlanModal: boolean;
  handleUpgradePlanModal: Function; // Optional boolean prop
}

const priceConfig = {
  monthly: {
    advanced: 39.99,
    premium: 199.99,
  },
  yearly: {
    advanced: 399.99,
    premium: 1999.99,
  },
};

const UpsellBanner: React.FC<UpgradeHeaderProps> = ({
  upgradePlanModal,
  handleUpgradePlanModal,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [yearly, setYearly] = useState(true);
  const [error, setError] = useState(false);
  const [plan, setPlan] = useState("advanced");
  const [loading, setLoading] = useState(false);
  const userInfo = useUser();

  const [coupon, setcoupon] = useState<string>("");
  const [applied, setApplied] = useState<boolean>(false);
  const [couponDetailsObj, setcouponDetailsObj] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);

  const postHog = usePostHog();

  let user: any;
  if (!userInfo.isLoggedIn) {
    user = JSON.parse(sessionStorage.getItem("userdata") ?? "{}");
  } else {
    user = userInfo.user;
  }

  const getDiscountedPrice = (value: number) => {
    if (applied && couponDetailsObj) {
      if (couponDetailsObj?.percent_off) {
        return (value * (100 - couponDetailsObj?.percent_off)) / 100;
      }
      if (couponDetailsObj?.amount_off) {
        return value - couponDetailsObj?.amount_off;
      }
    }
    return value;
  };

  const onSubmitButton = async () => {
    setLoading(true);
    try {
      const planDuration = yearly ? "yearly" : "monthly";

      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "some-authorizations",
        },
        body: JSON.stringify({
          plan: plan,
          duration: planDuration,
          email: user?.email,
          fullname: !userInfo.isLoggedIn
            ? `${user?.user_metadata?.firstName} ${user?.user_metadata?.lastName}`
            : user?.user_metadata?.full_name,
          coupon: couponDetailsObj?.id ?? "",
          supabaseid: user?.id,
          impactClickId: "",
          isLoggedIn: userInfo.isLoggedIn,
        }),
      });

      const session = await response.json();
      if (session?.url) {
        postHog.capture(postHogEvents.PLAN_UPGRADE_SUCCESS, {
          type: plan,
          platform: "web",
          email: user?.email,
          name: `${user?.user_metadata?.firstName} ${user?.user_metadata?.lastName}`,
          duration: planDuration,
          coupon: coupon ? true : false,
        });
        window.location.href = session.url;
      } else {
        postHog.capture(postHogEvents.PLAN_UPGRADE_FAILED, {
          type: plan,
          platform: "web",
          email: user?.email,
          name: `${user?.user_metadata?.firstName} ${user?.user_metadata?.lastName}`,
          duration: planDuration,
          coupon: coupon ? true : false,
          reason: session?.message || "Something went wrong",
        });
        router.push("plans");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  function handleProgress(params: any) {
    setPlan(params);
    setError(false);
  }

  const couponDiscount = async (coupon: string) => {
    if (!coupon) {
      toast({
        variant: "destructive",
        title: "Please enter coupon code",
      });
      return;
    }
    setLoader(true);
    try {
      const response = await fetch("/api/checkout/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "some-authorizations",
        },
        body: JSON.stringify({
          coupon,
        }),
      });
      const coupondetails = await response.json();

      if (coupondetails.couponData && coupondetails.couponData.valid) {
        setcouponDetailsObj(coupondetails.couponData);
        setApplied(true);
      } else {
        setcouponDetailsObj({});
        setApplied(false);
        toast({
          variant: "destructive",
          title: "Invalid Coupon",
          description: coupondetails.couponDetailsObj.message,
        });
      }
    } catch (error) {
      setcouponDetailsObj({});
      setApplied(false);
      toast({
        variant: "destructive",
        title: "Invalid Coupon",
        description: t("common:somethingWentWrong"),
      });
    } finally {
      setLoader(false);
    }
  };

  function removeCoupon() {
    setcoupon("");
    setcouponDetailsObj({});
    setApplied(false);
  }

  return (
    <Dialog open={upgradePlanModal}>
      <DialogContent
        data-testid="upsell_banner"
        className="h-auto max-h-[90vh] max-w-[95%] overflow-y-auto rounded-[4px] border border-[#E7E9EC] p-0 dark:border-[#2F3037] sm:max-w-[540px]"
      >
        <div className="sticky top-[-1px] flex h-[55px] items-center justify-center border-b border-[#E7E9EC] bg-[#fff] dark:border-[#2F3037] dark:bg-[#1a1a20]">
          <div className="ml-auto flex items-center text-[18px] font-[500]">
            <Image
              src={RocketImg}
              alt="rocket"
              height={30}
              width={30}
              className="mr-2 h-[30px] w-[30px]"
            />
            {t("rating:upgradePlanToUnlock")}
          </div>
          <AiOutlineClose
            data-testid="upsell-close"
            className="ml-auto mr-3 cursor-pointer"
            onClick={() => handleUpgradePlanModal(false)}
          />
        </div>
        <div className="px-2 pb-4 pt-0 text-[#71717A] dark:text-[#A1A1AA] sm:px-4">
          <div className="flex w-full flex-col sm:flex-row">
            <span className="my-2 flex w-full items-start text-[14px] font-[400] sm:w-1/2 sm:pr-2">
              <Image
                src={Tick}
                height={22}
                width={22}
                alt="green-tick"
                className="mr-[6px]"
              />
              {plan === "" && t("rating:bullBearMarketIndicator")}
              {plan === "advanced" && t("rating:tradingViewIndicator")}
              {plan === "premium" && t("rating:correlationAnalysis")}
            </span>
            <span className="my-2 flex w-full items-start text-[14px] font-[400] sm:w-1/2">
              <Image
                src={Tick}
                height={22}
                width={22}
                alt="green-tick"
                className="mr-[6px]"
              />
              {plan === "" && t("rating:aiCryptoChatbot")}
              {plan === "advanced" && t("rating:aiCryptoIndices")}
              {plan === "premium" && t("rating:sentimentAnalysis")}
            </span>
          </div>
          <div className="flex w-full flex-col sm:flex-row">
            <span className="my-2 flex w-full items-start text-[14px] font-[400] sm:w-1/2 sm:pr-2">
              <Image
                src={Tick}
                height={22}
                width={22}
                alt="green-tick"
                className="mr-[6px]"
              />
              {plan === "" && t("rating:aiCryptoAssetRatings")}
              {plan === "advanced" && t("rating:researchReportsGems")}
              {plan === "premium" && t("rating:exclusiveEarlyAccess")}
            </span>
            <span className="my-2 flex w-full items-start text-[14px] font-[400] sm:w-1/2">
              <Image
                src={Tick}
                height={22}
                width={22}
                alt="green-tick"
                className="mr-[6px]"
              />
              {plan === "" && t("rating:aiCryptoIndices")}
              {plan === "advanced" && t("rating:aiCryptoTradingSignals")}
              {plan === "premium" && t("rating:premiumGroup")}
            </span>
          </div>
          <div className="mb-2 flex w-full flex-col sm:flex-row">
            <span
              className={`my-2 flex items-start text-[14px] font-[400] ${
                plan === "advanced"
                  ? "inline-block w-full sm:w-1/2"
                  : "inline-block w-full"
              }`}
            >
              <Image
                src={Tick}
                height={22}
                width={22}
                alt="green-tick"
                className="mr-[6px]"
              />
              {plan === "" && t("rating:researchReports")}
              {plan === "advanced" && t("rating:sevenDayPricePredictions")}
              {plan === "premium" && t("rating:exclusiveWebinar")}
            </span>
            {plan === "advanced" && (
              <span className="my-2 flex items-start text-[14px] font-[400]">
                <Image
                  src={Tick}
                  height={22}
                  width={22}
                  alt="green-tick"
                  className="mr-2"
                />
                {t("rating:advancedTelegramGroup")}
              </span>
            )}
          </div>

          <Separator />

          <div className="mt-3 flex items-center justify-between sm:mb-3">
            <span className="text-[14px] font-[400]">
              {t("rating:yourCurrentPlan")}
            </span>
            <Badge className="flex h-[30px] min-w-[52px] items-center justify-center bg-[#fff5d6] text-[14px] font-[600] text-[#FFCF30] hover:bg-[#fff5d6] dark:bg-[#483e24] hover:dark:bg-[#483e24]">
              {t("common:basic")}
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between sm:mb-3">
            {applied ? (
              <div className="flex justify-between">
                <Badge
                  className="h-[40px] w-[50%] border border-[#E6E9EF] bg-[#f2f4fa] dark:border-[#414249] dark:bg-[#111116] lg:w-[200px]"
                  variant="secondary"
                  data-test-id="applied-coupon"
                >
                  Coupon applied {coupon}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleOff
                          size={18}
                          className="ml-4"
                          onClick={removeCoupon}
                          data-test-id="remove-coupon"
                          id={componentIDs.upgrade.removeCouponButton}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove Coupon</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
              </div>
            ) : (
              <>
                <Input
                  onChange={(e: any) => {
                    setcoupon(e.target.value);
                  }}
                  className="mr-2 h-[40px] w-[70%] rounded border-[#E6E9EF] bg-[#FFFFFF] outline-none dark:border-[#414249] dark:bg-[#1A1A20]"
                  autoComplete="off"
                  data-test-id="coupon-input"
                  placeholder="Enter Coupon Code"
                  id={componentIDs.upgrade.couponInput}
                />
                <Button
                  onClick={() => couponDiscount(coupon)}
                  className="h-[40px] w-[30%] border border-[#E6E9EF] bg-[#f2f4fa] dark:border-[#414249] dark:bg-[#111116] lg:w-[120px]"
                  data-test-id="apply-coupon-button"
                  id={componentIDs.upgrade.applyCouponButton}
                >
                  {loader ? <LoadingSpinner /> : t("signin:applybtn")}
                </Button>
              </>
            )}
          </div>
          <div className="mb-4 mt-2 flex flex-col items-center justify-between sm:my-5 sm:flex-row">
            <span className="text-[14px] font-[400]">
              {t("rating:readyToFindTheNext")}{" "}
              <span className="font-[600] text-[#1DB66C]">100X</span>?{" "}
              {t("rating:upgradeNow")}.
            </span>
            <div className="mt-3 flex items-center sm:mt-0">
              <span
                className={`mr-2 text-[14px] font-[600] ${yearly ? "font-[600] text-[#71717A] dark:text-[#A1A1AA]" : "font-[400]"}`}
              >
                {t("common:monthly")}
              </span>
              <Switch
                defaultChecked
                checked={yearly}
                onCheckedChange={() => setYearly(!yearly)}
                id={componentIDs.upgrade.yearlyMonthlyToggle}
              />
              <span
                className={`ml-1 text-[14px] ${yearly ? "font-[400]" : "font-[600] text-[#71717A] dark:text-[#A1A1AA]"}`}
              >
                {t("common:yearly")}
              </span>
            </div>
          </div>

          <RadioGroup onValueChange={handleProgress} value={plan}>
            <div className="flex items-center">
              <Label
                htmlFor="r1"
                className="mb-1 flex h-[50px] w-full cursor-pointer items-center justify-between rounded-[4px] border border-[#E6E9EF] bg-[#F2F4FA] px-3 dark:border-[#414249] dark:bg-[#111116]"
              >
                <span className="flex items-center">
                  <RadioGroupItem
                    value="advanced"
                    className="mr-2"
                    id={componentIDs.upgrade.advancedPlanRadio}
                  />
                  <span className="text-[16px] font-[500]">
                    {t("common:advanced")}
                  </span>
                </span>
                <span className="text-[16px] font-[600] text-[#1DB66C]">
                  $
                  {formatNumber(
                    getDiscountedPrice(
                      yearly
                        ? priceConfig.yearly.advanced
                        : priceConfig.monthly.advanced,
                    ),
                    2,
                  )}{" "}
                  {yearly ? t("common:plansyr") : t("common:plansmo")}
                </span>
              </Label>
            </div>
            <div className="flex items-center">
              <Label
                htmlFor="r2"
                className="mb-1 flex h-[50px] w-full cursor-pointer items-center justify-between rounded-[4px] border border-[#E6E9EF] bg-[#F2F4FA] px-3 dark:border-[#414249] dark:bg-[#111116]"
              >
                <span className="flex items-center">
                  <RadioGroupItem
                    value="premium"
                    className="mr-2"
                    id={componentIDs.upgrade.premiumPlanRadio}
                  />
                  <span className="text-[16px] font-[500]">
                    {t("common:premium")}
                  </span>
                </span>
                <span className="text-[16px] font-[600] text-[#1DB66C]">
                  $
                  {formatNumber(
                    getDiscountedPrice(
                      yearly
                        ? priceConfig.yearly.premium
                        : priceConfig.monthly.premium,
                    ),
                    2,
                  )}{" "}
                  {yearly ? t("common:plansyr") : t("common:plansmo")}
                </span>
              </Label>
            </div>
          </RadioGroup>
          {error && (
            <span className="text-sm text-red-500">
              {t("rating:pleaseSelectPlan")}
            </span>
          )}
          <div className="mt-4 flex w-full justify-between">
            <Button2
              loading={loading}
              data-testid="upgradePlan"
              className="mr-3 h-[50px] w-1/2 rounded-[4px] bg-[#FFCF30] text-[#09090B] sm:h-[36px]"
              onClick={() => onSubmitButton()}
              id={componentIDs.upgrade.startTrialButton}
            >
              {t("rating:plansFreeTrialBtn")}
            </Button2>
            <Button
              className="ml-3 h-[50px] w-1/2 rounded-[4px] border border-[#E6E9EF] bg-[#F2F4FA] dark:border-[#414249] dark:bg-[#111116] sm:h-[38px]"
              onClick={() => {
                const newWindow = window.open(
                  "https://www.tokenmetrics.com/pricing",
                  "_blank",
                );
                if (newWindow) {
                  newWindow.opener = null;
                }
              }}
              id={componentIDs.upgrade.comparePlansButton}
            >
              {t("rating:comparePlans")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsellBanner;
