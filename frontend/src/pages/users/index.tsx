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

  const { users, isLoading, error } = useManyUsers(1, search);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <>
            <Link
              to="/usuarios/criar"
              className={`btn-sm btn-secondary ${styles.createUserButton}`}
            >
              Criar usuário
            </Link>
            <section className={styles.header}>
              <h1>Usuários</h1>
              <p>Pesquise por usuários</p>
            </section>
            <Search
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onSubmit={(e) => e.preventDefault()}
              placeholder="Buscar usuários..."
            />
            <ul className={styles.userList}>
              {isLoading && <Loader />}
              {error && <p>Erro ao carregar usuários</p>}
              {users &&
                users.map((user) => (
                  <li key={user.id}>
                    <Card
                      className={`${styles.userItem} ${
                        selectedUser?.id === user.id && styles.selectedUser
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <I.user />
                      <h5 className={styles.userName}>{user.name}</h5>
                    </Card>
                  </li>
                ))}
            </ul>
          </>
        }
        rightSide={
          <>
            {selectedUser ? (
              <>
                <SelectedUserCard selectedUser={selectedUser} />
              </>
            ) : (
              <Card className={styles.nonSelectedUserBox}>
                <h1>Selecione um usuário</h1>
                <p>Selecione um usuário para ver mais detalhes sobre este.</p>
              </Card>
            )}
          </>
        }
        leftClassName={styles.left}
      />
    </Private>
  );
}
