'use client';

import { useState } from 'react';
import type { DBType, DatabaseCredentials } from '@/types';

type CredentialsPanelProps = {
  credentials: DatabaseCredentials | null;
  onCredentialsChange: (credentials: DatabaseCredentials | null) => void;
  onTestConnection: () => Promise<void>;
  isTestingConnection: boolean;
};

export function CredentialsPanel({
  credentials,
  onCredentialsChange,
  onTestConnection,
  isTestingConnection
}: CredentialsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dbType, setDbType] = useState<DBType>(credentials?.type || 'postgres');
  const [pgHost, setPgHost] = useState(credentials?.postgres?.host || 'localhost');
  const [pgPort, setPgPort] = useState(credentials?.postgres?.port || 5432);
  const [pgUsername, setPgUsername] = useState(credentials?.postgres?.username || '');
  const [pgPassword, setPgPassword] = useState(credentials?.postgres?.password || '');
  const [pgDatabase, setPgDatabase] = useState(credentials?.postgres?.database || '');

  const [mssqlServer, setMssqlServer] = useState(credentials?.mssql?.server || '');
  const [mssqlPort, setMssqlPort] = useState(credentials?.mssql?.port || 1433);
  const [mssqlUsername, setMssqlUsername] = useState(credentials?.mssql?.username || '');
  const [mssqlPassword, setMssqlPassword] = useState(credentials?.mssql?.password || '');
  const [mssqlDatabase, setMssqlDatabase] = useState(credentials?.mssql?.database || '');

  const [mysqlHost, setMysqlHost] = useState(credentials?.mysql?.host || 'localhost');
  const [mysqlPort, setMysqlPort] = useState(credentials?.mysql?.port || 3306);
  const [mysqlUsername, setMysqlUsername] = useState(credentials?.mysql?.username || 'root');
  const [mysqlPassword, setMysqlPassword] = useState(credentials?.mysql?.password || '');
  const [mysqlDatabase, setMysqlDatabase] = useState(credentials?.mysql?.database || '');

  const [sqliteFilePath, setSqliteFilePath] = useState(credentials?.sqlite?.filePath || ':memory:');

  const handleSaveCredentials = () => {
    if (dbType === 'postgres') {
      if (!pgHost || !pgUsername || !pgPassword || !pgDatabase) {
        alert('Please fill in all PostgreSQL fields');
        return;
      }

      onCredentialsChange({
        type: 'postgres',
        postgres: {
          host: pgHost,
          port: pgPort,
          username: pgUsername,
          password: pgPassword,
          database: pgDatabase
        }
      });
    } else if (dbType === 'mssql') {
      if (!mssqlServer || !mssqlUsername || !mssqlPassword || !mssqlDatabase) {
        alert('Please fill in all MSSQL fields');
        return;
      }

      onCredentialsChange({
        type: 'mssql',
        mssql: {
          server: mssqlServer,
          port: mssqlPort,
          username: mssqlUsername,
          password: mssqlPassword,
          database: mssqlDatabase
        }
      });
    } else if (dbType === 'mysql') {
      if (!mysqlHost || !mysqlUsername || !mysqlPassword || !mysqlDatabase) {
        alert('Please fill in all MySQL fields');
        return;
      }

      onCredentialsChange({
        type: 'mysql',
        mysql: {
          host: mysqlHost,
          port: mysqlPort,
          username: mysqlUsername,
          password: mysqlPassword,
          database: mysqlDatabase
        }
      });
    } else if (dbType === 'sqlite') {
      if (!sqliteFilePath) {
        alert('Please specify SQLite file path');
        return;
      }

      onCredentialsChange({
        type: 'sqlite',
        sqlite: {
          filePath: sqliteFilePath
        }
      });
    }

    setIsOpen(false);
  };

  const handleClearCredentials = () => {
    onCredentialsChange(null);
    setIsOpen(false);
  };

  const hasCredentials = credentials !== null;

  return (
    <div className="border-b border-slate-800 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition"
          >
            {isOpen ? '▼' : '▶'} {hasCredentials ? '✓ Custom Database' : '+ Add Credentials'}
          </button>
          {hasCredentials && (
            <button
              onClick={handleClearCredentials}
              className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition"
            >
              Clear
            </button>
          )}
        </div>

        {hasCredentials && !isOpen && (
          <span className="text-xs text-slate-400">
            {credentials.type === 'postgres'
              ? `PostgreSQL: ${credentials.postgres?.host}:${credentials.postgres?.port}`
              : credentials.type === 'mssql'
              ? `MSSQL: ${credentials.mssql?.server}`
              : credentials.type === 'mysql'
              ? `MySQL: ${credentials.mysql?.host}:${credentials.mysql?.port}`
              : `SQLite: ${credentials.sqlite?.filePath}`}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 p-4 bg-slate-900/80 border border-slate-700 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Database Type
            </label>
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value as DBType)}
              className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 rounded text-sm"
            >
              <option value="postgres">PostgreSQL</option>
              <option value="mssql">MSSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>

          {dbType === 'postgres' ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Host
                  </label>
                  <input
                    type="text"
                    value={pgHost}
                    onChange={(e) => setPgHost(e.target.value)}
                    placeholder="localhost"
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={pgPort}
                    onChange={(e) => setPgPort(parseInt(e.target.value) || 5432)}
                    placeholder="5432"
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={pgUsername}
                  onChange={(e) => setPgUsername(e.target.value)}
                  placeholder="postgres"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={pgPassword}
                  onChange={(e) => setPgPassword(e.target.value)}
                  placeholder="password"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Database
                </label>
                <input
                  type="text"
                  value={pgDatabase}
                  onChange={(e) => setPgDatabase(e.target.value)}
                  placeholder="mydb"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
            </>
          ) : dbType === 'mssql' ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Server
                  </label>
                  <input
                    type="text"
                    value={mssqlServer}
                    onChange={(e) => setMssqlServer(e.target.value)}
                    placeholder="localhost"
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={mssqlPort}
                    onChange={(e) => setMssqlPort(parseInt(e.target.value) || 1433)}
                    placeholder="1433"
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={mssqlUsername}
                  onChange={(e) => setMssqlUsername(e.target.value)}
                  placeholder="sa"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={mssqlPassword}
                  onChange={(e) => setMssqlPassword(e.target.value)}
                  placeholder="password"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Database
                </label>
                <input
                  type="text"
                  value={mssqlDatabase}
                  onChange={(e) => setMssqlDatabase(e.target.value)}
                  placeholder="mydb"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
            </>
          ) : dbType === 'mysql' ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Host
                  </label>
                  <input
                    type="text"
                    value={mysqlHost}
                    onChange={(e) => setMysqlHost(e.target.value)}
                    placeholder="localhost"
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={mysqlPort}
                    onChange={(e) => setMysqlPort(parseInt(e.target.value) || 3306)}
                    placeholder="3306"
                    className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={mysqlUsername}
                  onChange={(e) => setMysqlUsername(e.target.value)}
                  placeholder="root"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={mysqlPassword}
                  onChange={(e) => setMysqlPassword(e.target.value)}
                  placeholder="password"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Database
                </label>
                <input
                  type="text"
                  value={mysqlDatabase}
                  onChange={(e) => setMysqlDatabase(e.target.value)}
                  placeholder="mydb"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
              </div>
            </>
          ) : dbType === 'sqlite' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  File Path
                </label>
                <input
                  type="text"
                  value={sqliteFilePath}
                  onChange={(e) => setSqliteFilePath(e.target.value)}
                  placeholder=":memory: or /path/to/database.db"
                  className="w-full px-3 py-2 border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-500 rounded text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">Use :memory: for in-memory database or specify a file path</p>
              </div>
            </>
          ) : null}

          <div className="flex gap-2">
            <button
              onClick={handleSaveCredentials}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Save Credentials
            </button>
            <button
              onClick={onTestConnection}
              disabled={isTestingConnection}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 transition"
            >
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
