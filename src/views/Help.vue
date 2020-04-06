<template>
  <main>
    <back-arrow />
    <h1 class="mx-10 mb-1 px-1">Help</h1>
    <div class="my-shadow mx-12 mb-5 px-3 pt-2 pb-1 border-t-4 border-blue">
      <h2 class="pb-1">Set Up Database</h2>
      <p>
        To set up a database for use with Nevis v5, this only needs done on one
        computer to act as a 'server.'
      </p>
      <p>
        - Download the MySQL installer from
        <a href="#" class="link" @click="goToSQLDownloadExternal"
          >https://dev.mysql.com/downloads/installer/</a
        >
      </p>
      <p>
        - Run the installer and select the "Server only" setup type or ensure
        the MySQL Server is installed. Check all Requirements are met, and then
        install the server
      </p>
      <img
        class="smaller"
        src="@/assets/images/help/MYSQL-SetupType.png"
        alt="Select `Server only` MySQL Setup Type"
      />
      <img
        class="smaller"
        src="@/assets/images/help/MYSQL-Installation.png"
        alt="MySQL Installer - Install Server"
      />
      <p>- Check and Install any Requirements and the Server</p>
      <p>- Enter the Server Configuration and use the following options:</p>
      <ul>
        <li>
          <b> High Availability </b>
          <ul>
            <li>
              Select "Standalone MySQL Server / Classic MySQL Replication"
            </li>
          </ul>
        </li>
        <li>
          <b>Type and Networking</b>
          <ul>
            <li>Config Type: Development Computer</li>
            <li>Connectivity: TCP/IP</li>
            <li>Port 3306</li>
            <li>Open Firewall to Connections to Database</li>
          </ul>
        </li>

        <li>
          <b>Authentication Method </b>
          <ul>
            <li>Use Strong Password Encryption for Authentication</li>
          </ul>
        </li>
        <li>
          <b>Accounts and Roles </b>
          <ul>
            <li>Create a password for the root user</li>
            <li>Don't create any other users at this stage</li>
          </ul>
        </li>
        <li>
          <b>Windows Service</b>
          <ul>
            <li>Set Server to run as a service starting as System Start-Up</li>
            <li>Set to run as a Standard System Account</li>
          </ul>
        </li>
      </ul>
      <div class="gallery">
        <img
          src="@/assets/images/help/MYSQL-Network.png"
          alt="MySQL Installer - Select Networking Options"
        />
        <img
          src="@/assets/images/help/MYSQL-Authentication.png"
          alt="MySQL Installer - Set Secure Authentication Type"
        />
        <img
          src="@/assets/images/help/MYSQL-Accounts.png"
          alt="MySQL Installer - Set Root Password"
        />
        <img
          src="@/assets/images/help/MYSQL-Service.png"
          alt="MySQL Installer - Set Secure Authentication Type"
        />
      </div>
      <p>
        - Then apply configuration and finish installation
      </p>
      <p>
        - Open MySQL Command Line, login using the root password, then enter the
        following:
      </p>
      <div class="code">
        <p>
          CREATE USER 'sa'@'%' IDENTIFIED WITH mysql_native_password BY
          'orienteer'
        </p>
        <p>GRANT ALL PRIVILEGES ON * . * TO 'sa'@'%';</p>
        <p>CREATE DATABASE nevis;</p>
        <p>CREATE DATABASE archive;</p>
      </div>
      <p>
        - Replace "sa" and "orienteer" with your chosen username and password,
        if you don't want to use the default values in Nevis
      </p>
      <img
        class="smaller"
        src="@/assets/images/help/MYSQL-Commands.png"
        alt="Command Line Showing Commands Entered"
      />
      <p>- The database should now be setup to use with Nevis</p>
    </div>
    <div class="my-shadow mx-12 mb-5 px-3 pt-2 pb-1 border-t-4 border-blue">
      <h2 class="pb-1">Import Punches</h2>
      <p>To import punches from SIConfig+:</p>

      <p>
        - Open SIConfig+, Connect to the correct unit and go to the backup tab
      </p>

      <img
        src="@/assets/images/help/SIConfig-ReadBackup.png"
        alt="SIConfig+ open with the Backup tab"
      />
      <p>- Click Export>Export current view</p>
      <p>- You should have a view similar to this:</p>
      <img
        src="@/assets/images/help/SIConfig-SavePunches.png"
        alt="SIConfig+ Export Settings"
      />
      <p>
        - Enter the path to where you want the file to be saved, and make sure
        that the "Field delimeter" is "Semicolon" and the "Text delimiter" is
        "(none)"
      </p>

      <p>- Go to Safety Check in Nevis and import the file you just saved</p>
      <p>- The punches should now have been imported</p>
    </div>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'

export default {
  components: {
    'back-arrow': BackArrow,
  },

  methods: {
    goToSQLDownloadExternal: function (event) {
      event.preventDefault()
      this.$electron.shell.openExternal(
        'https://dev.mysql.com/downloads/installer/'
      )
    },
  },
}
</script>
<style scoped>
img {
  max-height: 20rem;
  margin: 0.5rem 2.5rem;
}

img.smaller {
  max-height: 15rem;
}

p {
  padding: 0.25rem 0;
  text-align: left;
}

ul,
h1,
h2,
h3,
h4,
h5,
h6,
li {
  text-align: left;
}
.gallery {
  text-align: center;
}
.gallery img {
  height: 16rem;
  margin: 0.5rem 1rem;
}
</style>
