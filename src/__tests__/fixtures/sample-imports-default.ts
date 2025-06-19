import { z, a, b, c } from "z";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import * as moment from "moment";
import {
  Observable,
  Subject,
  BehaviorSubject,
  of,
  from,
  throwError,
  combineLatest,
} from "rxjs";
import {
  map,
  filter,
  tap,
  catchError,
  switchMap,
  mergeMap,
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";
import DefaultExport from "default-module";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";

interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  age: number;
  isActive: boolean;
  roles: string[];
  createdAt: Date;
}

type UserRole = "admin" | "user" | "guest";
type Callback<T> = (data: T) => void;
type Dictionary<T> = { [key: string]: T };

enum StatusCode {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

class UserService {
  private users: UserInterface[] = [];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>("/api/users");
  }

  getUserById(id: number): Observable<UserInterface> {
    return this.http.get<UserInterface>(`/api/users/${id}`);
  }

  createUser(
    user: Omit<UserInterface, "id" | "createdAt">,
  ): Observable<UserInterface> {
    return this.http.post<UserInterface>("/api/users", user);
  }

  updateUser(
    id: number,
    user: Partial<UserInterface>,
  ): Observable<UserInterface> {
    return this.http.put<UserInterface>(`/api/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}

function mergeObjects<T extends object, U extends object>(
  obj1: T,
  obj2: U,
): T & U {
  return {
    ...obj1,
    ...obj2,
  };
}

const calculateTotal = (items: number[]): number =>
  items.reduce((sum, item) => sum + item, 0);

const fetchUserData = async (userId: number): Promise<UserInterface> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with ID ${userId}`);
  }
  return await response.json();
};

export {
  UserInterface,
  UserRole,
  StatusCode,
  UserService,
  mergeObjects,
  calculateTotal,
  fetchUserData,
};

export default UserService;
