import { TimelineConfig } from './timeline/Timeline'
import { ExternalStepConfig } from './steps/ExternalStep'

export enum StepType {
  TIMELINE = 'Timeline',
  PROCESS = 'Process',
  EXTERNAL = 'External'
}

export interface BaseStepConfig<TContext = Record<string, any>> {
  id: string
  label: string
  context: TContext
  stepType: StepType
  parent?: Step<StepType.TIMELINE>
  previous?: Step
  next?: Step
}

export type StepConfig = TimelineConfig | ExternalStepConfig

export abstract class Step<T = StepType> {
  /** A unique ID for the step, should remain the same across all instances of the step. */
  id: string

  /** A user-friendly display name for the step. */
  label: string

  /** The step type, allows serialisation and re-instantiation of the process. */
  abstract stepType: T

  /**
   * The context that the process applies to, in a repeating process this should be able to uniquely identify the
   * step from other instance of the same step in other timelines.
   */
  context: Record<string, any>

  constructor(config: BaseStepConfig) {
    this.id = config.id
    this.label = config.label
    this.context = config.context
    this.parent = config.parent
    this.previous = config.previous
    this.next = config.next
  }

  /** The parent timeline containing the step, if the step is at the top level then this will be undefined. */
  parent?: Step<StepType.TIMELINE>

  /** If the step is the first in a timeline then this will be undefined. */
  previous?: Step

  /** If the step is the last in a timeline then this will be undefined. */
  next?: Step

  /** If the step is ready to be marked as complete and the parent timeline can move on. */
  async canClose(): Promise<boolean> {
    return true
  }

  /**
   * A hook that will be called when the parent timeline is moving to another step. Usually this is the timeline
   * moving forward to the next step but it could also be the timeline moving backwards.
   *
   * @param isRevert A boolean to indicate that the step is being closed because the timeline is re-opening the
   * previous step.
   * @returns A boolean that indicates if the operation was successful
   */
  async close(isRevert?: boolean): Promise<boolean> {
    return await this.canClose()
  }

  /**
   * A hook that will be called when the step becomes the active step in it's parent timeline. The boolean value
   * indicates if the process was successful or not.
   *
   * @param isRevert A boolean to indicate that the activation is occuring because the step is being re-opened.
   * @returns A boolean that indicates if the operation was successful
   */
  async activate(isRevert?: boolean): Promise<boolean> {
    if (isRevert && !(await this.canRevert())) {
      return false
    }

    return true
  }

  /** If the step has already been complete, indicates if the timeline can revert back to it. */
  async canRevert(): Promise<boolean> {
    return true
  }
}
