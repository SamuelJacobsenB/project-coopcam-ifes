import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Card,
  DualPage,
  I,
  Loader,
  Navbar,
  PageHeader,
  Private,
  Search,
} from "../../components";
import {
  useManyBusTripReportsByUserAndMonth,
  useManyMonthlyPaymentByUserId,
  useManyUsers,
  useUserById,
} from "../../hooks";
import type { User } from "../../types";

import {
  SelectedUserCard,
  UserPaymentsCard,
  UserReportsCard,
} from "./components";

import styles from "./styles.module.css";

export function UsersPage() {
  const { id } = useParams<{ id: string }>();

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { getUserById } = useUserById();
  const { users, isLoading, error } = useManyUsers(activeSearch);

  const { getManyBusTripReportsByUserAndMonth } =
    useManyBusTripReportsByUserAndMonth();
  const { getMonthlyPaymentByUserId } = useManyMonthlyPaymentByUserId();

  const handleFetchReports = useCallback(
    async (month: number) => {
      if (!selectedUser) return [];
      return await getManyBusTripReportsByUserAndMonth({
        month,
        user_id: selectedUser.id,
      });
    },
    [selectedUser, getManyBusTripReportsByUserAndMonth],
  );

  const handleFetchPayments = useCallback(async () => {
    if (!selectedUser) return [];
    return await getMonthlyPaymentByUserId(selectedUser.id);
  }, [selectedUser, getMonthlyPaymentByUserId]);

  useEffect(() => {
    let isMounted = true;

    if (id) {
      getUserById(id).then((user: User) => {
        if (isMounted) {
          setSelectedUser(user);
          setActiveSearch(user.name);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id, getUserById]);

  console.log(selectedUser?.birth);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <aside className={styles.leftContainer}>
            <header className={styles.header}>
              <PageHeader title="Usuários" description="Gerencie usuários" />
              <Link
                to="/usuarios/criar"
                className={`btn-sm btn-primary ${styles.createBtn}`}
              >
                Novo
              </Link>
            </header>

            <hr />

            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSubmit={(e) => {
                e.preventDefault();
                setActiveSearch(search);
              }}
              placeholder="Pesquisar pelo nome"
            />

            <ul className={styles.userList} aria-label="Lista de utilizadores">
              {isLoading ? (
                <div className={styles.emptyState}>
                  <Loader />
                </div>
              ) : error ? (
                <div className={styles.emptyState}>
                  <p>Erro ao carregar usuário.</p>
                </div>
              ) : users?.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Nenhum usuário encontrado.</p>
                </div>
              ) : (
                users?.map((user) => (
                  <li key={user.id}>
                    <Card
                      className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.selectedUser : ""
                        }`}
                      onClick={() => setSelectedUser(user)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedUser?.id === user.id}
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
                ))
              )}
            </ul>
          </aside>
        }
        rightSide={
          <main className={styles.mainContent}>
            {selectedUser ? (
              <div className={styles.userArea}>
                <SelectedUserCard
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />

                <div className={styles.detailsGrid}>
                  <section className={styles.gridColumn}>
                    <h3>Relatórios de Viagem</h3>
                    <UserReportsCard handleFetch={handleFetchReports} />
                  </section>
                  <section className={styles.gridColumn}>
                    <h3>Histórico de Pagamentos</h3>
                    <UserPaymentsCard handleFetch={handleFetchPayments} />
                  </section>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </main>
        }
      />
    </Private>
  );
}

const EmptyState = () => (
  <section className={styles.rightPlaceholder} aria-live="polite">
    <I.user size={48} color="#cbd5e1" style={{ marginBottom: "1.5rem" }} />
    <h2>Nenhum usuário selecionado</h2>
    <p>Clique num usuário à esquerda para gerir os seus detalhes.</p>
  </section>
);
