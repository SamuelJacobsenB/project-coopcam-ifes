import { useState } from "react";
import { Link } from "react-router-dom";
import { useManyUsers } from "../../hooks";
import {
  Card,
  DualPage,
  I,
  Loader,
  Navbar,
  Private,
  Search,
} from "../../components";
import type { User } from "../../types";
import { SelectedUserCard } from "./components";
import styles from "./styles.module.css";

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Dica: Idealmente, adicione um 'debounce' aqui para não chamar a API a cada letra
  const { users, isLoading, error } = useManyUsers(1, search);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <div className={styles.leftContainer}>
            {/* Cabeçalho Fixo */}
            <header className={styles.headerRow}>
              <div className={styles.headerText}>
                <h1>Usuários</h1>
                <p>Gerencie o acesso</p>
              </div>
              <Link
                to="/usuarios/criar"
                className={`btn-sm btn-primary ${styles.createBtn}`}
              >
                Novo
              </Link>
            </header>

            {/* Busca Fixa */}
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSubmit={(e) => e.preventDefault()}
              placeholder="Buscar por nome..."
            />

            {/* Lista Scrollável */}
            <ul className={styles.userList}>
              {isLoading && (
                <div className={styles.emptyState}>
                  <Loader />
                </div>
              )}

              {error && (
                <div className={styles.emptyState}>
                  <p>Erro ao carregar.</p>
                </div>
              )}

              {!isLoading && !error && users?.length === 0 && (
                <div className={styles.emptyState}>
                  <p>Nenhum usuário encontrado.</p>
                </div>
              )}

              {users &&
                users.map((user) => (
                  <li key={user.id}>
                    <Card
                      className={`${styles.userItem} ${
                        selectedUser?.id === user.id ? styles.selectedUser : ""
                      }`}
                      onClick={() => setSelectedUser(user)}
                      tabIndex={0}
                      role="button"
                    >
                      <div className={styles.userIconWrapper}>
                        <I.user
                          size={20}
                          color={
                            selectedUser?.id === user.id
                              ? "var(--color-primary)"
                              : "#94a3b8"
                          }
                        />
                      </div>
                      <h5 className={styles.userName}>{user.name}</h5>
                    </Card>
                  </li>
                ))}
            </ul>
          </div>
        }
        rightSide={
          selectedUser ? (
            <SelectedUserCard
              selectedUser={selectedUser}
              setSelectedUser={(user) => setSelectedUser(user)}
            />
          ) : (
            <div className={styles.rightPlaceholder}>
              <I.user size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
              <h2>Nenhum usuário selecionado</h2>
              <p>
                Clique em um usuário na lista à esquerda para ver os detalhes
                completos.
              </p>
            </div>
          )
        }
      />
    </Private>
  );
}
