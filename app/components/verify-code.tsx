import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "./ui-lib";
import Paginator from "./pagination";

import styles from "./verify-code.module.scss";
import { Path } from "../constant";

interface Code {
  code: string;
  source: string;
  isUsed: Boolean;
  usedAt: any;
  validTo: any;
  remarks: string;
}

type Codes = Array<Code> | null;

export function VerifyCode() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const queryPage = query.get("page");

  const [codes, setCodes] = useState<Codes>(null);
  const [page, setPage] = useState(queryPage ? parseInt(queryPage) : 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const onPageChange = (page: number) => {
    navigate(`${Path.VerifyCode}?page=${page}`);
  };

  const fetchData = async () => {
    showToast("加载中...");
    try {
      const response = await fetch(`/api/verify-codes?page=${page}`);
      const data = await response.json();
      setCodes(data.codes);
      setPage(data.page);
      setTotalCount(data.total_count);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  useEffect(() => {
    console.log("trigger, serch change");
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    setPage(page ? parseInt(page) : 1);
  }, [location.search]);

  useEffect(() => {
    fetchData(); // 替换成实际的获取数据的函数
  }, [page]);

  const addRemark = async (code: { code: string }) => {
    const remarks = prompt("请为激活码分配手机号或者邮箱作为标识");

    if (remarks) {
      showToast("分配中...");
      try {
        const res = await fetch("/api/verify", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code.code,
            remarks,
          }),
        });
        if (res.ok) {
          return fetchData();
        } else {
          showToast("分配失败!");
        }
      } catch (e) {
        showToast("分配失败!");
      }
    }
  };

  return (
    <div className={styles["verify-code-ctn"]}>
      <div className={styles["titleWrap"]}>
        总数: {totalCount}，共{totalPages}页，当前第{page}页
      </div>
      {!!codes && (
        <table className={styles["verify-code-table"]}>
          <thead>
            <tr>
              <th>激活码</th>
              <th>来源</th>
              <th>是否激活</th>
              <th>激活日期</th>
              <th>有效期至</th>
              <th>分配信息</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.code}>
                <td>{code.code}</td>
                <td>{code.source}</td>
                <td>{code.isUsed ? "已激活" : "未激活"}</td>
                <td>{code.usedAt ? formatDate(code.usedAt) : "无"}</td>
                <td>{code.validTo ? formatDate(code.validTo) : "无"}</td>
                <td>{code.remarks}</td>
                <td>
                  <span
                    className={
                      code.remarks
                        ? styles["action-disabled"]
                        : styles["action"]
                    }
                    onClick={() => {
                      addRemark(code);
                    }}
                  >
                    分配
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {totalPages > 1 && (
        <Paginator
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        ></Paginator>
      )}
    </div>
  );
}
