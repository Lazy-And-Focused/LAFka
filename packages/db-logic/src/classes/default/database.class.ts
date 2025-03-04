import { Model } from "mongoose";

import {
	CreateData,
	Filter,
	FindOptions,
	UpdateOptions,
	Status as DatabaseStatus,
	CreateModelData,
	UpdateModelData,
	ModelNames,
	DeleteResult
} from "lafka/types/schema/mongodb.types";

import getData from "./helpers/database/get-data.helper";
import getAllModels from "./helpers/database/get-all-models.helper";
import deleteModel from "./helpers/database/delete-model.helper";

export interface DatabaseType<T extends { id: string }, K = Partial<T>> {
	name: ModelNames;
	model: Model<T>;
	id: Promise<string>;
	
	findLast: () => Promise<T>;
	generateId: () => Promise<string>;
	
	create: (doc: CreateData<T> & K) => CreateModelData<T>;
	update: (options: UpdateOptions<T>) => UpdateModelData;
	delete: (filter: Filter<T>) => Promise<DeleteResult>;
	
	getData: (options: FindOptions<T>) => Promise<DatabaseStatus<T[]>>;
	deleteModel: () => Promise<DatabaseStatus>;
}

class Database<T extends { id: string }, K = Partial<T>> implements DatabaseType<T, K> {
	private readonly _model: Model<T>;

	public constructor(model: Model<T>) {
		this._model = model;
	}

	public get name(): ModelNames {
		return this._model.modelName as ModelNames;
	}

	public get model() {
		return this._model;
	}

	public findLast = async (): Promise<Readonly<T>> => {
		return (await this._model.findOne({}, {}, { sort: { "created_at": -1 }, new: true }))!;
	}

	public generateId = async (): Promise<string> => {
		const id = await this._model.countDocuments();

		return `${(id === 0 ? 0 : (+(await this.findLast()).id)) + 1}`;
	};

	public create = async (doc: CreateData<T> & K) => {
		return await this._model.create({
			...doc,
			id: await this.id
		});
	};

	public update = async (options: UpdateOptions<T>) => {
		return await this._model.updateOne(options.filter, options.update);
	};

	public delete = async (filter: Filter<T>) => {
		return await this._model.deleteOne(filter);
	};

	public getData = async (
		options: FindOptions<T>
	): Promise<DatabaseStatus<T[]>> => {
		return await getData<T>(this._model, options);
	};

	public deleteModel = async (): Promise<DatabaseStatus> => {
		return await deleteModel(this._model.name);
	};

	public static getAllModels = async (): Promise<DatabaseStatus> => {
		return await getAllModels();
	};

	public static deleteModel = async (name: string): Promise<DatabaseStatus> => {
		return await deleteModel(name);
	};

	get id(): Promise<string> {
		return this.generateId();
	}
}

export default Database;
