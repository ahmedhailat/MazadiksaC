import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import AuctionDetails from "@/pages/auction-details";
import AuctionsPage from "@/pages/auctions";
import CategoriesPage from "@/pages/categories";
import ContactPage from "@/pages/contact";
import CheckoutPage from "@/pages/checkout";
import PaymentSuccessPage from "@/pages/payment-success";
import RewardsPage from "@/pages/rewards";
import AboutPage from "@/pages/about";
import CategoryCarsPage from "@/pages/category-cars";
import CategoryElectronicsPage from "@/pages/category-electronics";
import CategoryJewelryPage from "@/pages/category-jewelry";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import { RewardsDashboard } from "@/components/rewards/rewards-dashboard";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { AndroidFeatures } from "@/components/ui/android-features";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auctions" component={AuctionsPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/category/cars" component={CategoryCarsPage} />
      <Route path="/category/electronics" component={CategoryElectronicsPage} />
      <Route path="/category/jewelry" component={CategoryJewelryPage} />
      <Route path="/auction/:id" component={AuctionDetails} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/payment-success" component={PaymentSuccessPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/rewards" component={RewardsPage} />
      <Route path="/my-auctions" component={AuctionsPage} />
      <Route path="/notifications" component={() => <NotificationCenter />} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
        <InstallPrompt />
        <AndroidFeatures />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
