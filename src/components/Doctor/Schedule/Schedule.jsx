import DashboardLayout from "../DashboardLayout/DashboardLayout";
import React, { useEffect, useState } from "react";
import { Space, Tag, Button, Empty, message } from "antd";
import {
  useCreateTimeSlotMutation,
  useGetDoctorTimeSlotQuery,
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation,
} from "../../../redux/api/timeSlotApi";
import { FaWindowClose, FaPlus } from "react-icons/fa";
import UseModal from "../../UI/UseModal";
import TimePicer from "../../UI/form/TimePicer";
import TabForm from "../../UI/form/TabForm";

const Schedule = () => {
  const [key, setKey] = useState("sunday");
  const [timeSlot, setTimeSlot] = useState([]);
  const [editTimeSlot, setEditTimeSlot] = useState([]);
  const [addTimeSlot, setAddTimeSlot] = useState([]);
  const [deleteTimeSlot] = useDeleteTimeSlotMutation();
  const [newEditSlots, setNewEditSlots] = useState([]);
  const [
    UpdateTimeSlot,
    {
      isError: uIsError,
      error: uError,
      isLoading: UIsLoading,
      isSuccess: uIsSuccess,
    },
  ] = useUpdateTimeSlotMutation();
  const { data, refetch, isLoading, isError } = useGetDoctorTimeSlotQuery({
    day: key,
  });

  // content.log({data});
  const [
    createTimeSlot,
    { isError: AIsError, error, isLoading: AIsLoading, isSuccess },
  ] = useCreateTimeSlotMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const showModal = () => {
    setAddTimeSlot([]);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showEditModal = () => {
    setEditTimeSlot(timeSlot.map(item => ({ ...item }))); // deep copy existing
    setNewEditSlots([]); 
    setIsEditModalOpen(true);
  };

  const handleEditOk = () => {
    const toUpdate = editTimeSlot
    .filter((slot) => slot.startTime && slot.endTime) // skip incomplete
    .map((slot) => ({
      doctorTimeSlotId: slot.id,     // adjust field name if your API expects something else
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    const toCreate = newEditSlots
    .filter((slot) => slot.startTime && slot.endTime)
    .map((slot) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      day: key,
    }));

    if (toUpdate.length === 0 && toCreate.length === 0) {
      message.info("No changes to save");
      setIsEditModalOpen(false);
      return;
    }

      UpdateTimeSlot({ timeSlot: toUpdate, create: toCreate });
  };

  useEffect(() => {
    if (!UIsLoading && uIsError) {
      message.error(uError?.data?.message);
      setIsEditModalOpen(false);
    }
    if (uIsSuccess) {
      message.success("Successfully Slot Updated");
      setIsEditModalOpen(false);
    }
  }, [uIsSuccess, uIsError, UIsLoading, uError?.data?.message]);

  const handleEditStartTime = (id, time, timeString) => {
    setEditTimeSlot((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, startTime: timeString } : item
      )
    );
  };

  const handleEditEndTime = (id, time, timeString) => {
    setEditTimeSlot((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, endTime: timeString } : item
      )
    );
  };
  const handleEditCancel = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleOk = () => {
    const timeSlot = addTimeSlot?.map((item) => {
      const { id, ...rest } = item;
      return rest;
    });
    const data = {
      day: key,
      timeSlot: timeSlot,
    };
    createTimeSlot({ data });
  };
  useEffect(() => {
    if (!AIsLoading && AIsError) {
      message.error(error?.data?.message);
      setIsModalOpen(false);
    }
    if (isSuccess) {
      message.success("Successfully Add Time Slots");
      setIsModalOpen(false);
    }
  }, [isSuccess, AIsError, error?.data?.message, AIsLoading]);

  const handleStartTime = (id, time, timeString) => {
    setAddTimeSlot((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, startTime: timeString } : item
      )
    );
  };

  const handleEndTime = (id, time, timeString) => {
    setAddTimeSlot((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, endTime: timeString } : item
      )
    );
  };
  const handleOnSelect = (value) => {
    setKey(value);
    setTimeSlot([]);
  };

  useEffect(() => {
    if (data && data[0]?.id && data[0]?.timeSlot) {
      setTimeSlot(data[0].timeSlot);
    } else {
      setTimeSlot([]);
    }
  }, [data]);

  const removeEditSlot = (id) => {
    setEditTimeSlot((prev) => prev.filter((item) => item.id !== id));
  };
  const addField = (e) => {
    e.preventDefault();
  const newId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`; // or just use index
  setNewEditSlots(prev => [...prev, { id: newId }]);
};
const removeNew = (id) => {
  setNewEditSlots(prev => prev.filter(item => item.id !== id));
  };

  const removeFromAddTimeSlot = (id) => {
    setAddTimeSlot(addTimeSlot.filter((item) => item.id !== id));
  };
  const addInAddTimeSlot = (e) => {
    e.preventDefault();
    const newId = `add-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setAddTimeSlot([...addTimeSlot, { id: newId }]);
  };

  const deleteHandler = async (id) => {
    // message.loading("Deleting ...");
    try {
      const res = await deleteTimeSlot(id);
      if (res) {
        message.success("Successfully Deleted !!");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  let content = null;
  if (!isLoading && isError) content = <div>Something Went Wrong !</div>;
  if (!isLoading && !isError && data?.length === 0) content = <Empty />;
  if (!isLoading && !isError && data?.length > 0)
    content = (
      <>
        {data &&
          data.map((item, index) => (
            <div key={item.id + index}>
              <div>
                {item?.maximumPatient && (
                  <h6>Maximum Patient Limit : {item?.maximumPatient}</h6>
                )}
              </div>
              <Space
                size={[0, "small"]}
                wrap
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item?.timeSlot &&
                  item?.timeSlot.map((time, index) => (
                    <Tag
                      closable
                      onClose={() => deleteHandler(time.id)}
                      closeIcon={
                        <span
                          style={{
                            color: "white",
                            fontSize: "14px",
                            marginLeft: "10px",
                            textAlign: "center",
                          }}
                        >
                          <FaWindowClose />
                        </span>
                      }
                      bordered={false}
                      color="processing"
                      key={index + 2}
                      style={{
                        background: "var(--primaryColor)",
                        color: "#fff",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {time?.startTime} - {time?.endTime}
                    </Tag>
                  ))}
              </Space>
            </div>
          ))}
      </>
    );
  return (
    <>
      <DashboardLayout>
        <div className="w-100 mb-3 rounded p-3" style={{ height: "90vh" }}>
          <h5 className="text-title">Schedule Timings</h5>
          <TabForm
            content={content}
            data={data}
            handleOnSelect={handleOnSelect}
            showEditModal={showEditModal}
            showModal={showModal}
          />
        </div>
      </DashboardLayout>

      <UseModal
        title="Edit Time Slots"
        isModaOpen={isEditModalOpen}
        handleOk={handleEditOk}
        handleCancel={handleEditCancel}
      >
        <form>
          <div className="hours-info">
            <div className="row form-row hours-cont">
          {/* ──────────────── Existing (already saved) slots ──────────────── */}
        {editTimeSlot?.map((item) => (
          <React.Fragment key={item.id}>
                    <div
                      className="col-12 col-md-12 d-flex align-items-center justify-content-between"
                    >
                      <div className="row form-row">
                        <div className="col-12 col-md-6 col-sm-12 my-3">
                          <div className="form-group">
                            <label style={{ marginRight: "8px" }}>
                              Start Time
                            </label>
                            <TimePicer
                              handleFunction={handleEditStartTime}
                              time={item.startTime}
                              id={item.id}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-sm-12 my-3">
                          <div className="form-group">
                            <label style={{ marginRight: "8px" }}>
                              End Time
                            </label>
                            <TimePicer
                              handleFunction={handleEditEndTime}
                              time={item.endTime}
                              id={item.id}
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        danger
                        size="medium"
                        onClick={() => removeEditSlot(item.id)}
                        icon={<FaWindowClose />}
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "30px",
                          marginTop: "20px",
                        }}
                      ></Button>
                    </div>

                    <hr style={{ color: "var(--headingColor)" }} />
                  </React.Fragment>
                ))}

        {/* ────────────────  NEW slots being added in this edit session  ──────────────── */}
        {newEditSlots?.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className="col-12 col-md-12 d-flex align-items-center justify-content-between"
            >
              <div className="row form-row">
                <div className="col-12 col-md-6 col-sm-12 my-3">
                  <div className="form-group">
                    <label style={{ marginRight: "8px" }}>Start Time</label>
                    <TimePicer
                      handleFunction={(id, time, timeString) => {
                        setNewEditSlots((prev) =>
                          prev.map((s) =>
                            s.id === id ? { ...s, startTime: timeString } : s
                          )
                        );
                      }}
                      time={item.startTime || null}
                      id={item.id}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 col-sm-12 my-3">
                  <div className="form-group">
                    <label style={{ marginRight: "8px" }}>End Time</label>
                    <TimePicer
                      handleFunction={(id, time, timeString) => {
                        setNewEditSlots((prev) =>
                          prev.map((s) =>
                            s.id === id ? { ...s, endTime: timeString } : s
                          )
                        );
                      }}
                      time={item.endTime || null}
                      id={item.id}
                    />
                  </div>
                </div>
              </div>

              <Button
                danger
                size="medium"
                onClick={() => removeNew(item.id)}
                icon={<FaWindowClose />}
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "30px",
                  marginTop: "20px",
                }}
              />
            </div>
            <hr style={{ color: "var(--headingColor)" }} />
          </React.Fragment>
        ))}

            </div>
          </div>

          <div className="my-3" style={{ width: "150px" }}>
            <Button
              type="primary"
              size="medium"
              // htmlType="submit"
              onClick={(e) => addField(e)}
              block
              icon={<FaPlus />}
            >
              Add More
            </Button>
          </div>
        </form>
      </UseModal>

      <UseModal
        title="Add Time Slots"
        isModaOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      >
        <form>
          <div className="hours-info">
            <div className="row form-row hours-cont">
              {addTimeSlot &&
                addTimeSlot?.map((item) => (
                  <React.Fragment key={item.id}>
                    <div
                      className="col-12 col-md-12 d-flex align-items-center justify-content-between"
                    >
                      <div className="row form-row">
                        <div className="col-12 col-md-6 col-sm-12 my-3">
                          <div className="form-group">
                            <label style={{ marginRight: "8px" }}>
                              Start Time
                            </label>
                            <TimePicer
                              handleFunction={handleStartTime}
                              time={item.startTime}
                              id={item.id}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-sm-12 my-3">
                          <div className="form-group">
                            <label style={{ marginRight: "8px" }}>
                              End Time
                            </label>
                            <TimePicer
                              handleFunction={handleEndTime}
                              time={item.endTime}
                              id={item.id}
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        size="medium"
                        htmlType="submit"
                        onClick={() => removeFromAddTimeSlot(item?.id)}
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "30px",
                          marginTop: "20px",
                        }}
                        icon={<FaWindowClose />}
                      ></Button>
                    </div>

                    <hr style={{ color: "var(--headingColor)" }} />
                  </React.Fragment>
                ))}
            </div>
          </div>

          <div className="my-3" style={{ width: "150px" }}>
            <Button
              type="primary"
              size="medium"
              htmlType="submit"
              onClick={(e) => addInAddTimeSlot(e)}
              block
              icon={<FaPlus />}
            >
              Add More
            </Button>
          </div>
        </form>
      </UseModal>
    </>
  );
};
export default Schedule;
