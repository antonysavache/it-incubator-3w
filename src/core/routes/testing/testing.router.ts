import {Router} from "express";
import {SETTINGS} from "../../../settings";
import {testingController} from "./testing.controller";

export const testingRouter = Router({});

testingRouter.delete(SETTINGS.PATH.ALL_DATA, testingController.deleteAll)