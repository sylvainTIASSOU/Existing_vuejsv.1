<script>
//import SidebarLink from "./SidebarLink";
import { collapsed, toggleSidebar, sidebarWidth } from "./state";

import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const isActive = (path) => route.path === path;
    console.log(route.path)
    return { isActive, collapsed, toggleSidebar, sidebarWidth };

  },

};
</script>

<template>
  <!-- sidebar partial start  -->
  <div class=" sidebar" :style="{ width: sidebarWidth }">

    <div class="menu-icon d-block d-lg-none">
      <a href="#" data-toggle="sidebar" class="nav-link nav-link-lg collapse-btn">
        <img src="../../assets/images/menu-icon.svg" alt="menu-icon" />
      </a>
    </div>

    <aside id="sidebar-wrapper " class="mx-3">
      <!--title-->
      <div class="pt-4 pb-5 sidebar-brand profile-image">
        <span v-if="collapsed">
          <div>S</div>
          <div>D</div>
        </span>
        <h2 v-else class="text-center profile-name">Stocks Dashoboard</h2>
        <hr style="
            margin: 15px 20px !important;
            color: #ffffff;
            background: #ffffff;
            height: 1px !important;
          " />
      </div>

      <!-- centents-->
      <ul class="mx-3">
        <li class="">
          <router-link :to="'/'" :class="{ active: isActive('/') }" class=" route">
            <div  >
              <i :class ={collapsedStyle:collapsed} class=" fas fa-home" ></i>
            </div>
            
            <span class="" v-if="!collapsed">
              Home

            </span>

          </router-link>
        </li>
        <hr style="
            margin: 25px 20px 15px 0 !important;
            color: rgba(164, 164, 164, 1) !important;
            height: 1px !important;
          " />
        <li class="">
          <router-link :to="'/dashboard'" :class="{ active: isActive('/dashboard') }" class="route">
            <div class="">
              <svg  width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.15625 2.94922C4.78906 1.31641 6.73698 0.5 9 0.5C11.263 0.5 13.1966 1.31641 14.8008 2.94922C16.4336 4.55339 17.25 6.48698 17.25 8.75C17.25 11.013 16.4336 12.9609 14.8008 14.5938C13.1966 16.1979 11.263 17 9 17C6.73698 17 4.78906 16.1979 3.15625 14.5938C1.55208 12.9609 0.75 11.013 0.75 8.75C0.75 6.48698 1.55208 4.55339 3.15625 2.94922ZM13.8555 3.89453C12.5091 2.54818 10.8906 1.875 9 1.875C7.10938 1.875 5.49089 2.54818 4.14453 3.89453C2.79818 5.24089 2.125 6.85938 2.125 8.75C2.125 10.6406 2.79818 12.2591 4.14453 13.6055C5.49089 14.9518 7.10938 15.625 9 15.625C10.8906 15.625 12.5091 14.9518 13.8555 13.6055C15.2018 12.2591 15.875 10.6406 15.875 8.75C15.875 6.85938 15.2018 5.24089 13.8555 3.89453ZM8.48438 2.77734C8.6276 2.63411 8.79948 2.5625 9 2.5625C9.20052 2.5625 9.35807 2.63411 9.47266 2.77734C9.61589 2.89193 9.6875 3.04948 9.6875 3.25C9.6875 3.45052 9.61589 3.6224 9.47266 3.76562C9.35807 3.88021 9.20052 3.9375 9 3.9375C8.79948 3.9375 8.6276 3.88021 8.48438 3.76562C8.36979 3.6224 8.3125 3.45052 8.3125 3.25C8.3125 3.04948 8.36979 2.89193 8.48438 2.77734ZM4.61719 4.41016C4.76042 4.26693 4.91797 4.19531 5.08984 4.19531C5.29036 4.19531 5.46224 4.26693 5.60547 4.41016C5.7487 4.52474 5.82031 4.68229 5.82031 4.88281C5.82031 5.05469 5.7487 5.21224 5.60547 5.35547C5.46224 5.4987 5.29036 5.57031 5.08984 5.57031C4.91797 5.57031 4.76042 5.4987 4.61719 5.35547C4.5026 5.21224 4.44531 5.05469 4.44531 4.88281C4.44531 4.68229 4.5026 4.52474 4.61719 4.41016ZM12.3945 4.36719L13.3828 5.35547L10.332 8.40625C10.3607 8.52083 10.375 8.63542 10.375 8.75C10.375 9.1224 10.2318 9.45182 9.94531 9.73828C9.6875 9.99609 9.3724 10.125 9 10.125C8.6276 10.125 8.29818 9.99609 8.01172 9.73828C7.75391 9.45182 7.625 9.1224 7.625 8.75C7.625 8.3776 7.75391 8.0625 8.01172 7.80469C8.29818 7.51823 8.6276 7.375 9 7.375C9.11458 7.375 9.22917 7.38932 9.34375 7.41797L12.3945 4.36719ZM2.98438 8.27734C3.1276 8.13411 3.29948 8.0625 3.5 8.0625C3.70052 8.0625 3.85807 8.13411 3.97266 8.27734C4.11589 8.39193 4.1875 8.54948 4.1875 8.75C4.1875 8.95052 4.11589 9.1224 3.97266 9.26562C3.85807 9.38021 3.70052 9.4375 3.5 9.4375C3.29948 9.4375 3.1276 9.38021 2.98438 9.26562C2.86979 9.1224 2.8125 8.95052 2.8125 8.75C2.8125 8.54948 2.86979 8.39193 2.98438 8.27734ZM13.9844 8.27734C14.1276 8.13411 14.2995 8.0625 14.5 8.0625C14.7005 8.0625 14.8581 8.13411 14.9727 8.27734C15.1159 8.39193 15.1875 8.54948 15.1875 8.75C15.1875 8.95052 15.1159 9.1224 14.9727 9.26562C14.8581 9.38021 14.7005 9.4375 14.5 9.4375C14.2995 9.4375 14.1276 9.38021 13.9844 9.26562C13.8698 9.1224 13.8125 8.95052 13.8125 8.75C13.8125 8.54948 13.8698 8.39193 13.9844 8.27734ZM4.61719 12.1445C4.76042 12.0013 4.91797 11.9297 5.08984 11.9297C5.29036 11.9297 5.46224 12.0013 5.60547 12.1445C5.7487 12.2878 5.82031 12.4596 5.82031 12.6602C5.82031 12.832 5.7487 12.9896 5.60547 13.1328C5.46224 13.2474 5.29036 13.3047 5.08984 13.3047C4.91797 13.3047 4.76042 13.2474 4.61719 13.1328C4.5026 12.9896 4.44531 12.832 4.44531 12.6602C4.44531 12.4596 4.5026 12.2878 4.61719 12.1445ZM12.3945 12.1445C12.5378 12.0013 12.6953 11.9297 12.8672 11.9297C13.0677 11.9297 13.2253 12.0013 13.3398 12.1445C13.4831 12.2878 13.5547 12.4596 13.5547 12.6602C13.5547 12.832 13.4831 12.9896 13.3398 13.1328C13.2253 13.2474 13.0677 13.3047 12.8672 13.3047C12.6953 13.3047 12.5378 13.2474 12.3945 13.1328C12.2513 12.9896 12.1797 12.832 12.1797 12.6602C12.1797 12.4596 12.2513 12.2878 12.3945 12.1445Z"
                fill="white" />
            </svg>
            </div>
            
            <span class="" v-if="!collapsed">Dashboard</span>

          </router-link>
        </li>

        <hr style="
            margin: 25px 20px 15px 0 !important;
            color: rgba(164, 164, 164, 1) !important;
            height: 1px !important;
          " />
        <li class="">
          <router-link :to="'/analytics'" :class="{ active: isActive('/analytics') }" class="route">
            <div class="icon">
              <svg class="icon" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20V6H4V20H0ZM7 20V0H11V20H7ZM14 20V12H18V20H14Z" fill="white" />
            </svg>
            </div>
            

            <span class="" v-if="!collapsed">Analytics </span>

          </router-link>
        </li>

        <hr style="
            margin: 15px 20px 15px 0 !important;
            color: rgba(164, 164, 164, 1) !important;
            height: 1px !important;
          " />
        <li class="">

          <router-link :to="'/strategy'" :class="{ active: isActive('/strategy') }" class="route">
            <div class="icon">
              <svg class="icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.15 8.1L0 6.3V2.7L3.15 0.9L6.3 2.7V6.3L3.15 8.1ZM3.15 6.03L4.5 5.265V3.735L3.15 2.97L1.8 3.735V5.265L3.15 6.03ZM13.05 8.7975V6.705L16.2 8.55V14.85L10.8 18L5.4 14.85V8.55L8.55 6.705V8.7975L7.2 9.585V13.815L10.8 15.9075L14.4 13.815V9.585L13.05 8.7975ZM9.9 10.8V0H18L16.2 2.7L18 5.4H11.7V10.8H9.9Z"
                fill="white" />
            </svg>
            </div>
            
            <span class="" v-if="!collapsed">Strategy </span>


          </router-link>
        </li>


        <hr style="
            margin: 15px 20px 15px 0 !important;
            color: rgba(164, 164, 164, 1) !important;
            height: 1px !important;
          " />
        <li class="">
          <router-link :to="'/testing'" :class="{ active: isActive('/testing') }" class="route ">
            <div class="icon">
               <svg class="icon" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 0H5.66667V1.88889H1.88889V3.77778H5.66667V5.66667H1.88889V7.55556H5.66667V9.44444H0V0ZM5.66667 7.55556H7.55556V5.66667H5.66667V7.55556ZM5.66667 3.77778H7.55556V1.88889H5.66667V3.77778ZM9.44444 7.55556H17V17H15.1111V13.2222H11.3333V17H9.44444V7.55556ZM11.3333 11.3333H15.1111V9.44444H11.3333V11.3333ZM11.3333 0H17V5.66667H15.1111V1.88889H11.3333V0ZM0 11.3333H1.88889V15.1111H5.66667V17H0V11.3333Z"
                fill="white" />
            </svg>
            </div>
           

            <span class="" v-if="!collapsed">Testing</span>
          </router-link>

        </li>
        <hr style="
            margin: 15px 20px 15px 0 !important;
            color: rgba(164, 164, 164, 1) !important;
            height: 1px !important;
          " />

        <li>
          <span class="collapse-icon" :class="{ 'rotate-180': collapsed }" @click="toggleSidebar">
            <i class="fas fa-angle-double-left" />
          </span>
        </li>

      </ul>
    </aside>
  </div>
  <!-- sidebar partial end  -->

  <!--
  <div
    className="      flex flex-col space-y-10 py-10 w-[250px] h-screen fixed left-0 top-0 bg-backgroundColorGreen/90 "
  >
    
    <h1 class="text-3xl font-bold text-center text-white">
      <span v-if="collapsed"> 
        <div>S</div>
        <div>D</div>
      </span>
      <span v-else>Stocks Dashboard</span>
    </h1>

    <hr class="mx-4" />

   
    <div class="flex flex-col items-center justify-center space-y-[15px]">
      <SidebarLink to="/" icon="fas fa-dashboard ">Home</SidebarLink>

      <hr class="mx-4" />

      <SidebarLink to="/dashboard" icon="fas fa-columns">Dashboard</SidebarLink>
      <hr class="mx-4" />
      <SidebarLink to="/analytics" icon="fas fa-bar-chart"
        >Analytics</SidebarLink
      >
      
      <SidebarLink to="/strategy" icon="fas fa-cogs ">Strategy</SidebarLink>
      
      <SidebarLink to="/testing" icon="fas fa-filter">Testing</SidebarLink>
    </div>

    close icon
    <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="fas fa-angle-double-left" />
    </span>
  </div> -->
</template>

<style scoped>

.collapsedStyle {
  margin-left: 50rem;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.li {
  display: flex;
  align-items: center;

  cursor: pointer;
  position: relative;
  font-weight: 400;
  user-select: none;

  margin: 0.1em 0;
  padding: 0.4em;
  border-radius: 0.25em;
  height: 1.5em;

  color: white;
  text-decoration: none;
}

.li:hover {
  background-color: var(--sidebar-item-hover);
}

.li.active {
  background-color: var(--sidebar-item-active);
}

 li.icon {
  flex-shrink: 0;
  width: 25px;
  margin-right: 40rem;
}

:root {
  --sidebar-bg-color: #2f855a;
  --sidebar-item-hover: #38a169;
  --sidebar-item-active: #276749;
}

.sidebar {
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
  position: fixed;

  height: 100%;
  width: 250px;
  background-color: #21744C;
  z-index: 880;
  color: white;
  background-color: var(--sidebar-bg-color);
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar h1 {
  height: 2.5em;
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.2s linear;
}

.route.active {
  @apply flex items-center space-x-5 p-3 rounded-[10px] bg-white text-backgroundColorGreen font-bold;
}

.route {
  @apply text-white flex items-center space-x-5 p-3 rounded-[10px] hover:bg-white hover:text-backgroundColorGreen font-bold;
}

.route.active div svg,
.route.active path {
  fill: var(--sidebar-item-active);
}

.route:hover div svg,
.route:hover path {
  fill: var(--sidebar-item-hover);
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
