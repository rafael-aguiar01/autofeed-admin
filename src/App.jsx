import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const Dashboard = lazy(() => import("./pages/dashboard"));
const Article = lazy(() => import("./pages/dashboard/article"));
const EditArticle = lazy(() => import("./pages/dashboard/editArticle"));
const Script = lazy(() => import("./pages/dashboard/script"));
const Audio = lazy(() => import("./pages/dashboard/audio"));
const Instagram = lazy(() => import("./pages/dashboard/publish-instagram"));
const Whatsapp = lazy(() => import("./pages/dashboard/whatsapp"));
const Author = lazy(() => import("./pages/configuration/author"));
const LayoutConfig = lazy(() => import("./pages/portals/layout"))
const BannerConfig = lazy(() => import("./pages/portals/banner"))
const Scheduled = lazy(() => import("./pages/portals/scheduled"))
const MacroRegion = lazy(() => import("./pages/portals/macroRegion"))
const Login = lazy(() => import("./pages/auth/login"));
const ForgotPass3 = lazy(() => import("./pages/auth/forgot-password3"));
const Error = lazy(() => import("./pages/404"));

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";

import Loading from "@/components/Loading";

function App() {
  return (
    <main className="App  relative">
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password3" element={<ForgotPass3 />} />
        </Route>
        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="article" element={<Article />} />
          <Route path="edit-article/:slug" element={<EditArticle />} />
          <Route path="script" element={<Script />} />
          <Route path="audio" element={<Audio />} />
          <Route path="instagram" element={<Instagram />} />
          <Route path="whatsapp" element={<Whatsapp />} />
          <Route path="author" element={<Author />} />
          <Route path="layout" element={<LayoutConfig />} />
          <Route path="banner" element={<BannerConfig />} />
          <Route path="scheduled" element={<Scheduled />} />
          <Route path="macro-region" element={<MacroRegion />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Route>
        <Route
          path="/404"
          element={
            <Suspense fallback={<Loading />}>
              <Error />
            </Suspense>
          }
        />

      </Routes>
    </main>
  );
}

export default App;
