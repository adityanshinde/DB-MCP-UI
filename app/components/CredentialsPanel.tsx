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
    } else {
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
    }

    setIsOpen(false);
  };

  const handleClearCredentials = () => {
    onCredentialsChange(null);
    setIsOpen(false);
  };

  const hasCredentials = credentials !== null;

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            {hasCredentials ? '✓ Custom Database' : '+ Add Credentials'}
          </button>
          {hasCredentials && (
            <button
              onClick={handleClearCredentials}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Clear
            </button>
          )}
        </div>

        {hasCredentials && (
          <span className="text-sm text-gray-600">
            {credentials.type === 'postgres'
              ? `PostgreSQL: ${credentials.postgres?.host}:${credentials.postgres?.port}`
              : `MSSQL: ${credentials.mssql?.server}`}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Type
            </label>
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value as DBType)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="postgres">PostgreSQL</option>
              <option value="mssql">MSSQL</option>
            </select>
          </div>

          {dbType === 'postgres' ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Host
                  </label>
                  <input
                    type="text"
                    value={pgHost}
                    onChange={(e) => setPgHost(e.target.value)}
                    placeholder="localhost"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={pgPort}
                    onChange={(e) => setPgPort(parseInt(e.target.value) || 5432)}
                    placeholder="5432"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={pgUsername}
                  onChange={(e) => setPgUsername(e.target.value)}
                  placeholder="postgres"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={pgPassword}
                  onChange={(e) => setPgPassword(e.target.value)}
                  placeholder="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Database
                </label>
                <input
                  type="text"
                  value={pgDatabase}
                  onChange={(e) => setPgDatabase(e.target.value)}
                  placeholder="mydb"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Server
                  </label>
                  <input
                    type="text"
                    value={mssqlServer}
                    onChange={(e) => setMssqlServer(e.target.value)}
                    placeholder="localhost"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={mssqlPort}
                    onChange={(e) => setMssqlPort(parseInt(e.target.value) || 1433)}
                    placeholder="1433"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={mssqlUsername}
                  onChange={(e) => setMssqlUsername(e.target.value)}
                  placeholder="sa"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={mssqlPassword}
                  onChange={(e) => setMssqlPassword(e.target.value)}
                  placeholder="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Database
                </label>
                <input
                  type="text"
                  value={mssqlDatabase}
                  onChange={(e) => setMssqlDatabase(e.target.value)}
                  placeholder="mydb"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSaveCredentials}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Save Credentials
            </button>
            <button
              onClick={onTestConnection}
              disabled={isTestingConnection}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
            >
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
