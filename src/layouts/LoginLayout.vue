<template>
  <q-layout view="hHr LpR lFf" class="flex flex-center custom-background">
    <!-- Burbujas flotantes lentas -->
    <div class="bubbles-container">
      <div class="bubble" v-for="n in 8" :key="n"></div>
    </div>

    <div style="height: 100%" class="q-pa-md row items-center justify-center">
      <q-card bordered class="my-card q-pa-md">
        <q-form @submit.prevent="login">
          <q-card-section>
            <!-- Logo/Imagen arriba de Bienvenido -->
            <div class="text-center q-mb-md">
              <img
                src="~assets/loginsa.png"
                alt="Logo"
                class="login-image"
              />
            </div>

            <h6
              color="primary"
              class="row justify-center text-primary q-mt-none q-mb-sm"
            >
              Bienvenido
            </h6>
            <h6 class="row justify-center text-grey-6 q-mt-none q-mb-lg">
              Central de Requerimientos
            </h6>

            <q-banner
              v-if="DEMO_MODE"
              dense
              rounded
              class="bg-blue-1 text-blue-10 q-mb-md demo-banner"
            >
              <template v-slot:avatar>
                <q-icon name="science" color="primary" />
              </template>
              <div class="text-weight-bold">Modo demostración</div>
              <div class="text-caption">
                Haz clic en un usuario para autocompletar (contraseña
                <b>demo123</b>):
              </div>
              <div class="row q-gutter-xs q-mt-xs">
                <q-chip
                  v-for="u in demoUsers"
                  :key="u.email"
                  clickable
                  dense
                  color="primary"
                  text-color="white"
                  icon="person"
                  @click="usarDemo(u)"
                >
                  {{ u.rol }}
                </q-chip>
              </div>
              <template v-slot:action>
                <q-btn
                  flat
                  dense
                  no-caps
                  size="sm"
                  color="primary"
                  icon="restart_alt"
                  label="Restablecer datos demo"
                  @click="restablecerDemo"
                />
              </template>
            </q-banner>

            <q-select
              v-model="empresaSeleccionada"
              :options="empresas"
              option-label="nombre"
              option-value="id"
              label="Seleccionar Empresa"
              outlined
              dense
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="domain" color="primary" />
              </template>
            </q-select>

            <q-input
              ref="emailRef"
              autocomplete="current-password"
              v-model="email"
              label="Correo Electronico"
              outlined
              dense
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>

            <q-input
              ref="passwordRef"
              v-model="password"
              autocomplete="current-password"
              :type="isPwd ? 'password' : 'text'"
              label="Contrasena"
              outlined
              dense
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="q-mb-lg">
              <q-checkbox
                v-model="rememberMe"
                label="Recordar mi usuario"
                color="primary"
                class="custom-checkbox"
              />
            </div>
          </q-card-section>

          <q-card-section class="row justify-center q-pt-none">
            <q-btn
              type="submit"
              color="primary"
              label="Iniciar Sesión"
              class="full-width login-btn"
              size="lg"
              icon="login"
              :loading="loading"
              no-caps
            />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api, DEMO_MODE } from 'src/boot/axios';
import { DEMO_USERS, resetDemoData } from 'src/demo/mockApi';
import { useUsuariostore } from 'src/stores/usuario.store';
//css
import 'src/css/layouts/login.scss';

const email = ref('');
const password = ref('');
const isPwd = ref(true);
const rememberMe = ref(true);
const loading = ref(false);
const emailRef = ref(null);
const passwordRef = ref(null);
const empresaSeleccionada = ref(null);
const empresas = ref([]);

const router = useRouter();
const quasar = useQuasar();
const usuarioStore = useUsuariostore();

// ----- FUNCIONES -----
const demoUsers = DEMO_USERS;

const usarDemo = (u) => {
  email.value = u.email;
  password.value = u.password;
};

const restablecerDemo = () => {
  resetDemoData();
  usuarioStore.logout();
  getEmpresas();
  quasar.notify({
    message: 'Datos de demostración restablecidos.',
    icon: 'restart_alt',
    color: 'info',
  });
};

const login = async () => {
  if (!email.value || !password.value) {
    quasar.notify({
      message: 'Ingresa tu correo y contraseña',
      icon: 'warning',
      color: 'warning',
    });
    return;
  }

  if (rememberMe.value && email.value) {
    localStorage.setItem('email', email.value);
  } else {
    localStorage.removeItem('email');
  }

  try {
    loading.value = true;
    usuarioStore.perfil = null;
    const resp = await usuarioStore.loginEmpresa(
      email.value,
      password.value,
      empresaSeleccionada.value?.id ?? undefined,
    );

    if (resp.estado !== 'OK') {
      throw new Error(
        resp.data?.response?.data?.message || 'Correo o contraseña incorrectos',
      );
    }

    await router.push('/select-area');
    quasar.notify({
      message: `Bienvenido/a ${resp.data.data.nombre || ''}`.trim(),
      icon: 'waving_hand',
      color: 'positive',
    });
  } catch (error) {
    quasar.notify({
      message: error.message || 'Error al ingresar',
      icon: 'close',
      color: 'negative',
    });
  } finally {
    loading.value = false;
  }
};

const getEmpresas = async () => {
  const response = await api.get('/empresa');
  empresas.value = response.data;
};

// ----- ON MOUNT -----
onMounted(() => {
  const storedEmail = localStorage.getItem('email');
  getEmpresas();
  if (storedEmail) {
    email.value = storedEmail;
    rememberMe.value = true;
  }
});
</script>
