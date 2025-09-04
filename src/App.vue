<template>
    <div id="app">
      <nav class="navbar">
        <div class="nav-brand">
          <i class="fas fa-wallet"></i>
          Finance Manager
        </div>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link"><i class="fas fa-tachometer-alt"></i> Dashboard</router-link></li>
          <li><router-link to="/budget" class="nav-link"><i class="fas fa-calculator"></i> Budget</router-link></li>
          <li><router-link to="/needs" class="nav-link"><i class="fas fa-exclamation-triangle"></i> Needs</router-link></li>
          <li><router-link to="/wants" class="nav-link"><i class="fas fa-heart"></i> Wants</router-link></li>
        </ul>
      </nav>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  // Main app component with navigation
  </script>
  
  <style scoped>
  .navbar {
    background: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }
  
  .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .nav-link:hover,
  .nav-link.router-link-active {
    background-color: #34495e;
  }
  
  .main-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  </style>