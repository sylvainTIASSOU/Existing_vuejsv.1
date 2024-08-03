<template>
  <div class="flex bg-backgroundColorGreen">
    <div>
      <Sidebar />
    </div>

    <section class="container-fluid " :class ={style:collapsed}>

      
      <div
      class="bg-white main-content"   
    >
      <!-- nav bar -->
      <div class="mobile-view">
        <nav
          class="sticky flex items-center flex-nowrap navbar navbar-expand-lg main-navbar justify-content-between"
        >
          <div class="flex items-center space-x-10 w-100">
            <div class="bars " 
            >
             
                <i class="text-gray-200 fas fa-search"></i
              >
            </div>
            <div class="form-floating position-relative w-50 d-none d-md-block">
             <!-- <i class="fas fa-search"></i>-->
          
              <input
              type="text"
              
                class=" form-control" 
                id="floatingSelect" aria-label="Floating label select example"
              />
                
              
            </div>
            <button class="header-btn d-none d-md-block">Search</button>
          </div>

          <ul class="gap-3 navbar-nav navbar-right justify-content-end">
            <li class="dropdown dropdown-list-toggle">
              <a
                href="#"
                data-toggle="dropdown"
                class="nav-link notification-toggle nav-link-lg"
              >
                <svg
                  width="24"
                  height="26"
                  viewBox="0 0 24 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.0277 0C7.73472 0 5.80843 1.72411 5.55522 4.00306L4.5 13.5H1.5C0.671573 13.5 0 14.1716 0 15V16.5C0 17.3284 0.671573 18 1.5 18H22.5C23.3284 18 24 17.3284 24 16.5V15C24 14.1716 23.3284 13.5 22.5 13.5H19.5L18.4448 4.00306C18.1916 1.72411 16.2653 0 13.9723 0H10.0277Z"
                    fill="#21744B"
                  />
                  <rect
                    opacity="0.3"
                    x="9"
                    y="19.5"
                    width="6"
                    height="6"
                    rx="2.25"
                    fill="black"
                  />
                </svg>
                <span class="badge headerBadge1"> 6 </span>
              </a>

              <div
                class="dropdown-menu dropdown-list dropdown-menu-right pullDown"
              >
                <div class="dropdown-header">
                  Notifications
                  <div class="float-right">
                    <a href="#">Mark All As Read</a>
                  </div>
                </div>
                <div class="dropdown-list-content dropdown-list-icons">
                  <a href="#" class="dropdown-item dropdown-item-unread">
                    <span class="text-white dropdown-item-icon bg-primary">
                      <i class="fas fa-code"></i>
                    </span>
                    <span class="dropdown-item-desc">
                      Template update is available now!
                      <span class="time">2 Min Ago</span>
                    </span>
                  </a>
                  <a href="#" class="dropdown-item">
                    <span class="text-white dropdown-item-icon bg-info">
                      <i class="far fa-user"></i>
                    </span>
                    <span class="dropdown-item-desc">
                      <b>You</b> and <b>Dedik Sugiharto</b> are now friends
                      <span class="time">10 Hours Ago</span>
                    </span>
                  </a>
                  <a href="#" class="dropdown-item">
                    <span class="text-white dropdown-item-icon bg-success">
                      <i class="fas fa-check"></i>
                    </span>
                    <span class="dropdown-item-desc">
                      <b>Kusnaedi</b> has moved task <b>Fix bug header</b> to
                      <b>Done</b> <span class="time">12 Hours Ago</span>
                    </span>
                  </a>
                  <a href="#" class="dropdown-item">
                    <span class="text-white dropdown-item-icon bg-danger">
                      <i class="fas fa-exclamation-triangle"></i>
                    </span>
                    <span class="dropdown-item-desc">
                      Low disk space. Let's clean it!
                      <span class="time">17 Hours Ago</span>
                    </span>
                  </a>
                  <a href="#" class="dropdown-item">
                    <span class="text-white dropdown-item-icon bg-info">
                      <i class="fas fa-bell"></i>
                    </span>
                    <span class="dropdown-item-desc">
                      Welcome to Otika template!
                      <span class="time">Yesterday</span>
                    </span>
                  </a>
                </div>
                <div class="text-center dropdown-footer">
                  <a href="#">View All <i class="fas fa-chevron-right"></i></a>
                </div>
              </div>
            </li>

            <li class="dropdown d-flex align-items-center">
              <a
                href="#"
                data-toggle="dropdown"
                class="gap-3 nav-link dropdown-toggle nav-link-lg nav-link-user d-flex align-items-center"
              >
                <img
                  alt="image"
                  src="../assets/img/user.png"
                  class="user-img-radious-style"
                />
                <span class="d-sm-none d-lg-inline-block"></span>

                <div class="d-none d-md-block">
                  <span class="text-dark">Moni Roy</span>
                  <p class="mb-0 p-color" style="margin-top: -11px">Admin</p>
                </div>
                <div class="d-none d-md-block">
                  <img
                    class="img-fluid"
                    width="15px"
                    height="auto"
                    src="../assets/images/down-drop.png"
                    alt=""
                  />
                </div>
              </a>
              <div class="dropdown-menu dropdown-menu-right pullDown">
                <div class="dropdown-title">Hello Sarah Smith</div>
                <a href="profile.html" class="dropdown-item has-icon">
                  <i class="far fa-user"></i> Profile
                </a>
                <a href="timeline.html" class="dropdown-item has-icon">
                  <i class="fas fa-bolt"></i>
                  Activities
                </a>
                <a href="#" class="dropdown-item has-icon">
                  <i class="fas fa-cog"></i>
                  Settings
                </a>
                <div class="dropdown-divider"></div>
                <a
                  href="auth-login.html"
                  class="dropdown-item has-icon text-danger"
                >
                  <i class="fas fa-sign-out-alt"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      
      <!-- nav bar close -->
      <router-view />
    </div>
    </section>
    
  </div>
</template>

<script setup>

import Sidebar from "./sidebar-api/SidebarMenu.vue";
//import SidebarLink from "./SidebarLink";
import { collapsed, toggleSidebar, sidebarWidth } from "./sidebar-api/state";


// Your setup logic
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.style {
  margin-left: -189px;
  width: auto
}

.content {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  overflow: auto; /* Enable scrolling if content overflows */
  padding: 1em;
}
</style>

<style>
:root {
  --sidebar-width: 0px; /* Default width */
}
</style>
