import { supabase } from './supabase';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Fonction pour créer l'utilisateur initial si nécessaire
export const initializeDefaultUser = async () => {
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Erreur lors de la vérification des utilisateurs:', usersError);
    return;
  }

  // Si aucun utilisateur n'existe, créer l'utilisateur par défaut
  if (!users || users.length === 0) {
    const { error: createError } = await supabase.auth.admin.createUser({
      email: 'mrnguetsa@gmail.com',
      password: 'kryss',
      email_confirm: true
    });

    if (createError) {
      console.error('Erreur lors de la création de l\'utilisateur par défaut:', createError);
    }
  }
};