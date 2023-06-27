import axios from 'axios';
import { LoggerInstance } from 'winston';

import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockUserCase1 } from '../../../test/unit/utils/mockUserCase';

import { CaseApi, CaseUpdateException } from './CaseApi';
jest.mock('axios');

describe('ErrorController', () => {
  let mockLogger: LoggerInstance;
  beforeEach(() => {
    mockLogger = {
      error: jest.fn().mockImplementation((message: string) => message),
    } as unknown as LoggerInstance;
  });

  test('Should throw error when case could not be fetched', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockRejectedValue({
      config: { method: 'GET', url: 'https://example.com' },
      request: 'mock request',
    });
  });

  test('Should return case roles for userId and caseId passed', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValue({
      data: {
        case_users: [
          {
            case_id: '1624351572550045',
            user_id: '372ff9c1-9930-46d9-8bd2-88dd26ba2475',
            case_role: '[APPLICANTTWO]',
          },
        ],
      },
    });
  });

  test('Should throw error when case roles could not be fetched', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockRejectedValue({
      config: { method: 'GET', url: 'https://example.com/case-users' },
      request: 'mock request',
    });
  });

  test('Should throw exception on failure to update the case', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const controller = new CaseApi(mockedAxios, mockLogger);
    const req = mockRequest();
    await expect(controller.updateCase(req, mockUserCase1, 'update')).rejects.toThrow(
      new CaseUpdateException('Error in updating case', '')
    );
  });
});
