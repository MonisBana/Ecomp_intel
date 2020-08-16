import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import MyPage from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import PriceHistory from "./Component/PriceHistory/PriceHistory";
import PriceChange from "./pages/PriceChange";
import Top10 from "./pages/Top10";
import LCH from "./pages/LCH";
import DiscountGrid from "./pages/DiscountGrid";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/comp_price" component={MyPage} />
        <ContentRoute path="/price_change" component={PriceChange} />
        <ContentRoute path="/top_10" component={Top10} />
        <ContentRoute path="/lch" component={LCH} />
        <ContentRoute path="/discount_grid" component={DiscountGrid} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} />
        <Route
          path="/PriceHistory/:comp_name/:sku_id"
          component={PriceHistory}
        />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
