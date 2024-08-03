<template >
  <!-- nav bar -->
  <div class="mobile-view">
    <nav
      class="sticky flex-nowrap navbar navbar-expand-lg main-navbar justify-content-between"
    >
      <div class="gap-3 form-inline d-flex w-100">
        <div class="bars">
          <a
            href="#"
            data-toggle="sidebar"
            class="text-gray-400 nav-link nav-link-lg collapse-btn"
          >
            <i class="text-gray-400 fas fa-align-justify"></i
          ></a>
        </div>
        <div class="justify-center items-center form-floating position-relative w-50 d-none d-md-block">
          <i class="fas fa-search"></i>
       <!--   <svg
            class="header-circle"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.49996 9.66667C9.37996 9.66667 9.24662 9.66001 9.11995 9.65334C8.87329 9.64001 8.6733 9.44001 8.6533 9.19334C8.50663 7.33334 6.99329 5.82666 5.13995 5.67999C4.89329 5.65999 4.69329 5.46001 4.67995 5.21334C4.67329 5.08667 4.66663 4.96 4.66663 4.83333C4.66663 2.16667 6.83329 0 9.49996 0C12.1666 0 14.3333 2.16667 14.3333 4.83333C14.3333 7.5 12.1666 9.66667 9.49996 9.66667ZM5.66663 4.73999C7.65329 5.08666 9.24664 6.68 9.5933 8.66667C11.6666 8.61333 13.3333 6.92 13.3333 4.83333C13.3333 2.72 11.6133 1 9.49996 1C7.41996 1 5.71996 2.66666 5.66663 4.73999Z"
              fill="black"
            />
            <path
              d="M4.83333 14.3333C2.16667 14.3333 0 12.1667 0 9.49999C0 6.83332 2.16667 4.66666 4.83333 4.66666C4.95333 4.66666 5.08667 4.67332 5.21334 4.67998C7.56667 4.86665 9.47334 6.77333 9.65334 9.11333C9.66001 9.24667 9.66667 9.37332 9.66667 9.49999C9.66667 12.1667 7.5 14.3333 4.83333 14.3333ZM4.83333 5.66666C2.72 5.66666 1 7.38666 1 9.49999C1 11.6133 2.72 13.3333 4.83333 13.3333C6.94667 13.3333 8.66667 11.6133 8.66667 9.49999C8.66667 9.39332 8.66001 9.28666 8.65334 9.18666C8.50667 7.33999 6.99999 5.82665 5.13999 5.67998C5.04666 5.67332 4.94 5.66666 4.83333 5.66666Z"
              fill="black"
            />
            <path
              d="M1.16667 4.06C1.01333 4.06 0.866658 4.03333 0.719991 3.97333C0.279991 3.79333 0 3.36666 0 2.89333V1.16667C0 0.526667 0.526667 0 1.16667 0H2.89333C3.36666 0 3.78666 0.279991 3.97333 0.719991C4.15333 1.15999 4.05332 1.65999 3.71999 1.99333L1.99333 3.71999C1.76666 3.93999 1.47333 4.06 1.16667 4.06ZM1.16667 1C1.07333 1 1 1.07333 1 1.16667V2.89333C1 2.99333 1.06666 3.03334 1.1 3.04667C1.14 3.06 1.21334 3.07999 1.28001 3.01333L3.00667 1.28666C3.07334 1.22 3.06 1.14667 3.04 1.10667C3.02 1.06667 2.97999 1.00667 2.88666 1.00667H1.16667V1Z"
              fill="black"
            />
            <path
              d="M13.1665 14.3333H11.4399C10.9665 14.3333 10.5466 14.0533 10.3599 13.6133C10.1799 13.1733 10.2799 12.6733 10.6132 12.34L12.3399 10.6133C12.6732 10.28 13.1732 10.18 13.6132 10.36C14.0532 10.54 14.3332 10.9667 14.3332 11.44V13.1667C14.3332 13.8067 13.8065 14.3333 13.1665 14.3333ZM13.1599 11.2733C13.1265 11.2733 13.0866 11.2867 13.0466 11.3267L11.3199 13.0533C11.2532 13.12 11.2665 13.1933 11.2865 13.2333C11.3065 13.2733 11.3465 13.3333 11.4399 13.3333H13.1665C13.2599 13.3333 13.3332 13.26 13.3332 13.1667V11.44C13.3332 11.34 13.2666 11.3 13.2332 11.2867C13.2132 11.28 13.1865 11.2733 13.1599 11.2733Z"
              fill="black"
            />
          </svg>-->
          <input
          type="text"
          
            class="form-select"
              
            aria-label="Search"
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
</template>

<script>
  export default {
    name: 'Nav',
  }
</script>